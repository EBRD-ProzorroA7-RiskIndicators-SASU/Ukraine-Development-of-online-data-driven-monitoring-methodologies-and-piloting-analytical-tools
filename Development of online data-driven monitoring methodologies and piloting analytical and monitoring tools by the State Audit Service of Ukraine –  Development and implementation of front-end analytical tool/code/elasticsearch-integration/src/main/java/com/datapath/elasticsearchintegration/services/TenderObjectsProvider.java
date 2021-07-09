package com.datapath.elasticsearchintegration.services;

import com.datapath.druidintegration.model.druid.response.common.Event;
import com.datapath.druidintegration.service.ExtractTenderDataService;
import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.elasticsearchintegration.util.Mapping;
import com.datapath.indicatorsqueue.domain.audit.Monitoring;
import com.datapath.indicatorsqueue.services.audit.ProzorroAuditService;
import com.datapath.persistence.repositories.TenderRepository;
import com.datapath.persistence.repositories.queue.RegionIndicatorsQueueItemRepository;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;


@Service
@Slf4j
@Data
public class TenderObjectsProvider {
    private final TenderRepository tenderRepository;
    private final ProzorroAuditService prozorroAuditService;
    private final ElasticsearchDataUploadService elasticsearchDataUpload;
    private final ExtractTenderDataService extractTenderDataService;
    private final RegionIndicatorsQueueItemRepository regionIndicatorsQueueItemRepository;

    private final String COVID_19_PROCEDURE_TYPE = "covid19";
    private final String REPORTING = "reporting";
    private final String COVID_19_PROCUREMENT_METHOD_RATIONALE = "COVID-19";

    @Value("${elastic.initial-interval:null}")
    private Integer elasticInitInterval;
    @Value("${elastic.update-interval:1}")
    private Integer elasticUpdateInterval;
    @Value("${elastic.scheduling.delay:10}")
    private Integer elasticSchedulingDelay;
    @Value("${elastic.tasks.enabled:false}")
    private boolean elasticTasksEnabled;


    public TenderObjectsProvider(RegionIndicatorsQueueItemRepository regionIndicatorsQueueItemRepository,
                                 ExtractTenderDataService extractTenderDataService,
                                 ElasticsearchDataUploadService elasticsearchDataUpload,
                                 ProzorroAuditService prozorroAuditService,
                                 TenderRepository tenderRepository) {
        this.regionIndicatorsQueueItemRepository = regionIndicatorsQueueItemRepository;
        this.extractTenderDataService = extractTenderDataService;
        this.elasticsearchDataUpload = elasticsearchDataUpload;
        this.prozorroAuditService = prozorroAuditService;
        this.tenderRepository = tenderRepository;
    }

    private void fillIndicatorsInfo(Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfo) {
        log.info("fill indicators start");
        List<String> tenderIds = new ArrayList<>(tenderIndicatorsCommonInfo.keySet());
        List<Event> lastTendersData = extractTenderDataService.getLastTendersData(tenderIds);
        lastTendersData.forEach(event -> {
            String tenderOuterId = event.getTenderOuterId();
            String indicatorId = event.getIndicatorId();
            if (Mapping.RISK_INDICATORS_ACTIVE.keySet().contains(indicatorId)) {
                tenderIndicatorsCommonInfo.get(event.getTenderOuterId()).getIndicators().add(indicatorId);
            }
            if (event.getIndicatorValue() == 1) {
                tenderIndicatorsCommonInfo.get(tenderOuterId).getIndicatorsWithRisk().add(indicatorId);
                tenderIndicatorsCommonInfo.get(tenderOuterId).setTenderRiskScore(tenderIndicatorsCommonInfo
                        .get(tenderOuterId).getTenderRiskScore() + event.getIndicatorImpact());
            } else {
                tenderIndicatorsCommonInfo.get(tenderOuterId).getIndicatorsWithOutRisk().add(indicatorId);
            }
        });
        log.info("fill indicators finish");
    }

    private void fillTenderInfo(Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfo) {
        log.info("fill tenders start");

        List<Object[]> tendersCommonInfo = tenderRepository.getTendersCommonInfo(
                String.join(",", tenderIndicatorsCommonInfo.keySet()));

        tendersCommonInfo.forEach(item -> {
            String tenderId = isNull(item[1]) ? null : item[1].toString();
            String cpv = isNull(item[6]) ? null : item[6].toString();

            boolean hasAwardComplaints = Boolean.parseBoolean(item[14].toString());
            boolean hasTenderComplaints = Boolean.parseBoolean(item[16].toString());

            TenderIndicatorsCommonInfo tenderIndicator = tenderIndicatorsCommonInfo.get(isNull(item[0]) ? null : item[0].toString());
            tenderIndicator.setGsw(isNull(cpv) ? null : extractGswFromCpv(cpv));
            tenderIndicator.setCpv(cpv);
            tenderIndicator.setCpv2(isNull(item[8]) ? null : item[8].toString());
            tenderIndicator.setRegion(isNull(item[13]) ? null : item[13].toString());
            tenderIndicator.setCpvName(isNull(item[7]) ? null : item[7].toString());
            tenderIndicator.setCpv2Name(isNull(item[9]) ? null : item[9].toString());
            tenderIndicator.setTenderId(tenderId);
            tenderIndicator.setCurrency(isNull(item[5]) ? null : item[5].toString());
            tenderIndicator.setTenderStatus(isNull(item[2]) ? null : item[2].toString());
            tenderIndicator.setExpectedValue(isNull(item[4]) ? null : Double.parseDouble(item[4].toString()));
            tenderIndicator.setHasComplaints(hasAwardComplaints || hasTenderComplaints);
            tenderIndicator.setTenderName(isNull(item[15]) ? null : String.valueOf(item[15].toString()));
            tenderIndicator.setProcuringEntityEDRPOU(isNull(item[10]) ? null : item[10].toString());
            tenderIndicator.setProcuringEntityName(isNull(item[12]) ? null : item[12].toString());
            tenderIndicator.setProcuringEntityKind(isNull(item[11]) ? null : item[11].toString());
            tenderIndicator.setDatePublished(tenderId.substring(3, 13));

            String procurementMethodType = isNull(item[3]) ? null : item[3].toString();
            String procurementMethodRationale = isNull(item[17]) ? null : item[17].toString();

            tenderIndicator.setProcedureType(
                    REPORTING.equals(procurementMethodType)
                            && COVID_19_PROCUREMENT_METHOD_RATIONALE.equals(procurementMethodRationale) ?
                            COVID_19_PROCEDURE_TYPE :
                            procurementMethodType
            );
        });
        log.info("fill tenders finish");
    }

    private String extractGswFromCpv(String cpv) {
        return cpv.startsWith("45") ? "Works" : "Goods/Services";
    }

    private Map<String, Monitoring> getMonitoringsMap() throws IOException {
        Map<String, Monitoring> tendersMonitoringMap = new HashMap<>();
        prozorroAuditService
                .getMonitorings()
                .forEach(monitoring -> tendersMonitoringMap.put(monitoring.getId(), monitoring));
        return tendersMonitoringMap;
    }

    private Map<String, Boolean> getTopTendersMap() {
        return regionIndicatorsQueueItemRepository.getAllTendersIdsAndTops()
                .stream()
                .map(item -> new HashMap.SimpleEntry<>(item[0].toString(), Boolean.parseBoolean(item[1].toString())))
                .collect(Collectors.toMap(AbstractMap.SimpleEntry::getKey, AbstractMap.SimpleEntry::getValue));
    }

    private void fillMonitoringInfo(Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfo,
                                    Map<String, Monitoring> monitoringMap) {
        log.info("fill monitoring start");

        tenderIndicatorsCommonInfo.keySet().forEach(tenderId -> {
            if (monitoringMap.containsKey(tenderId)) {
                Monitoring monitoring = monitoringMap.get(tenderId);
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringStatus(monitoring.getStatus());
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringAppeal(monitoring.isAppeal());
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringCause(monitoring.getCauses());
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringId(monitoring.getMonitoringId());
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringOffice(monitoring.getOffice());
            } else {
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringStatus("None");
            }
        });
        log.info("fill monitoring finish");
    }

    void provide(Integer interval) throws IOException {
        Map<String, Monitoring> tendersMonitoringMap = getMonitoringsMap();
        Map<String, Boolean> tendersTopMap = getTopTendersMap();

        Pageable pageRequest = PageRequest.of(0, 1000);
        Page<String> tendersPage;

        int tendersCount = 0;
        do {
            tendersPage = tenderRepository.findAllAfterDateModified(ZonedDateTime.now().minusDays(interval), pageRequest);
            pageRequest = tendersPage.nextPageable();

            log.info("Fetch tender ids start");
            List<String> tenderIds = tendersPage.getContent();
            log.info("Fetch tender ids finished");

            if (tenderIds.isEmpty()) {
                break;
            }

            log.info("map tender indicator info start");
            Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfoMap =
                    tenderIds.stream().collect(Collectors.toMap(
                            tenderId -> tenderId,
                            tenderId -> TenderIndicatorsCommonInfo.builder()
                                    .tenderRiskScore(0d)
                                    .tenderOuterId(tenderId)
                                    .indicators(new HashSet<>())
                                    .indicatorsWithRisk(new HashSet<>())
                                    .indicatorsWithOutRisk(new HashSet<>())
                                    .inQueue(tendersTopMap.containsKey(tenderId))
                                    .hasPriorityStatus(tendersTopMap.getOrDefault(tenderId, false))
                                    .build()));
            log.info("map tender indicator info start");
            fillMonitoringInfo(tenderIndicatorsCommonInfoMap, tendersMonitoringMap);
            fillIndicatorsInfo(tenderIndicatorsCommonInfoMap);
            fillTenderInfo(tenderIndicatorsCommonInfoMap);
            elasticsearchDataUpload.uploadItems(new ArrayList<>(tenderIndicatorsCommonInfoMap.values()));
            tendersCount += tenderIds.size();
            log.info("{} tenders uploaded.", tendersCount);
        } while (tendersPage.hasNext());
    }


    public void init() throws IOException {
        if (elasticTasksEnabled) {
            provide(elasticInitInterval);
            ScheduledExecutorService scheduledExecutorService =
                    Executors.newScheduledThreadPool(1);
            scheduledExecutorService.scheduleWithFixedDelay(() -> {
                try {
                    log.info("Start scheduled update");
                    provide(elasticUpdateInterval);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }, 0, elasticSchedulingDelay, TimeUnit.MINUTES);
        }
    }
}

