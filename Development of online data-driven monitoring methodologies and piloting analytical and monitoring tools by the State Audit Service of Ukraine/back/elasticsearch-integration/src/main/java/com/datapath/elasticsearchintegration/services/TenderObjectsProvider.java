package com.datapath.elasticsearchintegration.services;

import com.datapath.druidintegration.model.druid.response.common.Event;
import com.datapath.druidintegration.service.ExtractTenderDataService;
import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.elasticsearchintegration.util.Mapping;
import com.datapath.persistence.entities.Checklist;
import com.datapath.persistence.entities.ChecklistIndicator;
import com.datapath.persistence.entities.Couse;
import com.datapath.persistence.entities.MonitoringEntity;
import com.datapath.persistence.entities.queue.RegionIndicatorsQueueItemHistory;
import com.datapath.persistence.repositories.MonitoringRepository;
import com.datapath.persistence.repositories.TenderRepository;
import com.datapath.persistence.repositories.queue.RegionIndicatorsQueueItemHistoryRepository;
import com.datapath.persistence.repositories.queue.RegionIndicatorsQueueItemRepository;
import com.datapath.persistence.service.ChecklistDaoService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.StringUtils.isEmpty;


@Service
@Slf4j
@Data
public class TenderObjectsProvider {
    private final TenderRepository tenderRepository;
    private final MonitoringRepository monitoringRepository;
    private final ElasticsearchDataUploadService elasticsearchDataUpload;
    private final ExtractTenderDataService extractTenderDataService;
    private final RegionIndicatorsQueueItemRepository regionIndicatorsQueueItemRepository;
    private final RegionIndicatorsQueueItemHistoryRepository regionIndicatorsQueueItemHistoryRepository;
    private final ChecklistDaoService checklistDaoService;

    private final String NEW_PROCEDURE_TYPE = "covid19";
    private final String NEW_PROCEDURE_TYPE_PROCUREMENT_METHOD = "reporting";
    private final String NEW_PROCEDURE_PROCUREMENT_METHOD_RATIONALE = "COVID-19";

    @Value("${elastic.initial-interval:null}")
    private Integer elasticInitInterval;
    @Value("${elastic.update-interval:1}")
    private Integer elasticUpdateInterval;
    @Value("${elastic.tasks.enabled:false}")
    private Boolean elasticTasksEnabled;

    public TenderObjectsProvider(RegionIndicatorsQueueItemRepository regionIndicatorsQueueItemRepository,
                                 ExtractTenderDataService extractTenderDataService,
                                 ElasticsearchDataUploadService elasticsearchDataUpload,
                                 MonitoringRepository monitoringRepository,
                                 TenderRepository tenderRepository,
                                 RegionIndicatorsQueueItemHistoryRepository regionIndicatorsQueueItemHistoryRepository,
                                 ChecklistDaoService checklistDaoService) {
        this.regionIndicatorsQueueItemRepository = regionIndicatorsQueueItemRepository;
        this.extractTenderDataService = extractTenderDataService;
        this.elasticsearchDataUpload = elasticsearchDataUpload;
        this.monitoringRepository = monitoringRepository;
        this.tenderRepository = tenderRepository;
        this.regionIndicatorsQueueItemHistoryRepository = regionIndicatorsQueueItemHistoryRepository;
        this.checklistDaoService = checklistDaoService;
    }

    private void fillIndicatorsInfo(Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfo) {
        log.info("fill indicators start");
        List<String> tenderIds = new ArrayList<>(tenderIndicatorsCommonInfo.keySet());
        List<Event> lastTendersData = extractTenderDataService.getLastTendersData(tenderIds);
        lastTendersData.forEach(event -> {
            String tenderOuterId = event.getTenderOuterId();
            String indicatorId = event.getIndicatorId();
            if (Mapping.RISK_INDICATORS_ACTIVE.containsKey(indicatorId)) {
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

            String gsw = isNull(item[22]) ? null : item[22].toString();
            if (isEmpty(gsw)) {
                gsw = extractGswFromCpv(cpv);
            }

            tenderIndicator.setGsw(gsw);
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
            tenderIndicator.setMaterialityScore(isNull(item[17]) ? null : Double.parseDouble(item[17].toString()));
            tenderIndicator.setDatePublished(tenderId.substring(3, 13));

            tenderIndicator.setDocumentsCount(Integer.parseInt(item[19].toString()));
            tenderIndicator.setLotsCount(Integer.parseInt(item[20].toString()));
            tenderIndicator.setBidsCount(Integer.parseInt(item[21].toString()));

            String procurementMethodType = isNull(item[3]) ? null : item[3].toString();
            String procurementMethodRationale = isNull(item[18]) ? null : item[18].toString();
            processProcedureType(tenderIndicator, procurementMethodType, procurementMethodRationale);
            processFeedbackStatuses(tenderIndicator, item);
        });
        log.info("fill tenders finish");
    }

    private void processFeedbackStatuses(TenderIndicatorsCommonInfo tenderIndicator, Object[] item) {
        boolean hasMonitoringInfo = Boolean.parseBoolean(item[23].toString());
        boolean hasSummary = Boolean.parseBoolean(item[25].toString());
        boolean hasViolation = Boolean.parseBoolean(item[26].toString());
        boolean hasResult = Boolean.parseBoolean(item[24].toString());
        boolean hasIndicators = Boolean.parseBoolean(item[27].toString());

        List<String> feedbackStatuses = new ArrayList<>();
        if (hasMonitoringInfo) feedbackStatuses.add(
                Mapping.FEEDBACK_STATUS.get("hasMonitoringInfo").getKey().toString()
        );
        if (hasSummary) feedbackStatuses.add(
                Mapping.FEEDBACK_STATUS.get("hasSummary").getKey().toString()
        );
        if (hasViolation) feedbackStatuses.add(
                Mapping.FEEDBACK_STATUS.get("hasViolation").getKey().toString()
        );
        if (hasResult) feedbackStatuses.add(
                Mapping.FEEDBACK_STATUS.get("hasResult").getKey().toString()
        );
        if (hasIndicators) feedbackStatuses.add(
                Mapping.FEEDBACK_STATUS.get("hasIndicators").getKey().toString()
        );
        tenderIndicator.setFeedbackStatuses(feedbackStatuses);
    }

    private String extractGswFromCpv(String cpv) {
        return cpv.startsWith("45") ? "works" : "Goods/Services";
    }

    private void processProcedureType(TenderIndicatorsCommonInfo tenderIndicator, String procurementMethodType,
                                      String procurementMethodRationale) {
        if (NEW_PROCEDURE_TYPE_PROCUREMENT_METHOD.equals(procurementMethodType) && NEW_PROCEDURE_PROCUREMENT_METHOD_RATIONALE.equals(procurementMethodRationale)) {
            tenderIndicator.setProcedureType(NEW_PROCEDURE_TYPE);
        } else {
            tenderIndicator.setProcedureType(procurementMethodType);
        }
    }

    private void fillProcedureLogType(Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfo) {
        log.info("fill procedure log type started");

        Map<String, Checklist> tenderChecklist = checklistDaoService.findByTenderOuterIds(
                new ArrayList<>(tenderIndicatorsCommonInfo.keySet()))
                .stream()
                .collect(Collectors.toMap(Checklist::getTenderOuterId, c -> c));

        Set<String> queueHistoryTenderIds = regionIndicatorsQueueItemHistoryRepository.findByTenderIdIn(
                tenderIndicatorsCommonInfo.values()
                        .stream()
                        .map(TenderIndicatorsCommonInfo::getTenderId)
                        .collect(Collectors.toList())
        ).stream()
                .map(RegionIndicatorsQueueItemHistory::getTenderId)
                .collect(Collectors.toSet());

        tenderIndicatorsCommonInfo.values().forEach(t -> {
            Checklist checklist = tenderChecklist.get(t.getTenderOuterId());

            boolean hasChecklist = false;
            boolean isPriority = t.isHasPriorityStatus();
            boolean isMonitoring = !t.getMonitoringStatus().equals("None");

            if (nonNull(checklist)) {
                Set<String> checklistIndicators = checklist.getIndicators()
                        .stream()
                        .map(ChecklistIndicator::getIndicator)
                        .collect(Collectors.toSet());

                if (!t.getIndicatorsWithRisk().equals(checklistIndicators) &&
                        !checklistIndicators.containsAll(t.getIndicatorsWithRisk())) {

                    checklistDaoService.removeByTenderOuterId(t.getTenderOuterId());
                    tenderChecklist.remove(t.getTenderOuterId());
                } else {
                    hasChecklist = true;
                }
            }

            if (t.inQueue) {
                if (hasChecklist) {
                    if (isPriority) {
                        t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("priorityAnalyzed").getKey().toString());
                    } else {
                        t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("notPriorityAnalyzed").getKey().toString());
                    }
                } else {
                    if (isPriority) {
                        t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("priorityNotAnalyzed").getKey().toString());
                    } else {
                        t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("notPriorityNotAnalyzed").getKey().toString());
                    }
                }
            } else if (queueHistoryTenderIds.contains(t.getTenderId())) {
                if (isMonitoring) {
                    if (hasChecklist) {
                        if (isPriority) {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyPriorityAnalyzedMonitoring").getKey().toString());
                        } else {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyNotPriorityAnalyzedMonitoring").getKey().toString());
                        }
                    } else {
                        if (isPriority) {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyPriorityNotAnalyzedMonitoring").getKey().toString());
                        } else {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyNotPriorityNotAnalyzedMonitoring").getKey().toString());
                        }
                    }
                } else {
                    if (hasChecklist) {
                        if (isPriority) {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyPriorityAnalyzed").getKey().toString());
                        } else {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyNotPriorityAnalyzed").getKey().toString());
                        }
                    } else {
                        if (isPriority) {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyPriorityNotAnalyzed").getKey().toString());
                        } else {
                            t.setProcedureLogType(Mapping.PROCEDURE_LOG_TYPES.get("historyNotPriorityNotAnalyzed").getKey().toString());
                        }
                    }
                }
            }
        });

        log.info("fill procedure log type finished");
    }

    private Map<String, MonitoringEntity> getMonitoringsMap() {
        Map<String, MonitoringEntity> tendersMonitoringMap = new HashMap<>();
        monitoringRepository
                .findAll()
                .forEach(monitoring -> tendersMonitoringMap.put(monitoring.getTenderId(), monitoring));
        return tendersMonitoringMap;
    }

    private Map<String, Boolean> getTopTendersMap() {
        return regionIndicatorsQueueItemRepository.getAllTendersIdsAndTops()
                .stream()
                .map(item -> new HashMap.SimpleEntry<>(item[0].toString(), Boolean.parseBoolean(item[1].toString())))
                .collect(Collectors.toMap(AbstractMap.SimpleEntry::getKey, AbstractMap.SimpleEntry::getValue));
    }

    private void fillMonitoringInfo(Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfo,
                                    Map<String, MonitoringEntity> monitoringMap) {
        log.info("fill monitoring start");

        tenderIndicatorsCommonInfo.keySet().forEach(tenderId -> {
            if (monitoringMap.containsKey(tenderId)) {
                MonitoringEntity monitoring = monitoringMap.get(tenderId);
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringStatus(monitoring.getStatus());
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringAppeal(monitoring.isAppeal());
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringCause(
                        monitoring.getCauses()
                                .stream()
                                .map(Couse::getReason)
                                .collect(Collectors.toList())
                );
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringId(monitoring.getId());
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringOffice(monitoring.getOffice());
            } else {
                tenderIndicatorsCommonInfo.get(tenderId).setMonitoringStatus("None");
            }
        });
        log.info("fill monitoring finish");
    }

    private void provide(Integer interval, Map<String, MonitoringEntity> tendersMonitoringMap, Map<String, Boolean> tendersTopMap) {
        try {
            log.info("elasticsearch tenders integration started");

            Pageable pageRequest = PageRequest.of(0, 1000);
            Page<String> tendersPage;

            int tendersCount = 0;
            do {
                tendersPage = tenderRepository.findAllAfterDateModified(ZonedDateTime.now().minusDays(interval), pageRequest);
                pageRequest = tendersPage.nextPageable();

                List<String> tenderIds = tendersPage.getContent();

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

                fillMonitoringInfo(tenderIndicatorsCommonInfoMap, tendersMonitoringMap);
                fillIndicatorsInfo(tenderIndicatorsCommonInfoMap);
                fillTenderInfo(tenderIndicatorsCommonInfoMap);
                fillProcedureLogType(tenderIndicatorsCommonInfoMap);
                elasticsearchDataUpload.uploadItems(new ArrayList<>(tenderIndicatorsCommonInfoMap.values()));
                tendersCount += tenderIds.size();
                log.info("{} tenders uploaded.", tendersCount);
            } while (tendersPage.hasNext());

            log.info("elasticsearch tenders integration finished");
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }

    void provideBasedOnMonitoring(Map<String, MonitoringEntity> tendersMonitoringMap, Map<String, Boolean> tendersTopMap) {
        try {
            log.info("elasticsearch monitoring integration started");

            Set<String> tenderOuterIds = tendersMonitoringMap.keySet();

            int count = 0;
            int skip = 0;
            int limit = 1000;

            do {
                log.info("map tender indicator info start");

                Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfoMap = tenderOuterIds
                        .stream()
                        .skip(skip)
                        .limit(limit)
                        .collect(Collectors.toMap(
                                tenderId -> tenderId,
                                tenderId -> TenderIndicatorsCommonInfo.builder()
                                        .tenderRiskScore(0d)
                                        .tenderOuterId(tenderId)
                                        .indicators(new HashSet<>())
                                        .indicatorsWithRisk(new HashSet<>())
                                        .indicatorsWithOutRisk(new HashSet<>())
                                        .inQueue(tendersTopMap.containsKey(tenderId))
                                        .hasPriorityStatus(tendersTopMap.getOrDefault(tenderId, false))
                                        .build()
                                )
                        );

                fillMonitoringInfo(tenderIndicatorsCommonInfoMap, tendersMonitoringMap);
                fillIndicatorsInfo(tenderIndicatorsCommonInfoMap);
                fillTenderInfo(tenderIndicatorsCommonInfoMap);
                fillProcedureLogType(tenderIndicatorsCommonInfoMap);
                elasticsearchDataUpload.uploadItems(new ArrayList<>(tenderIndicatorsCommonInfoMap.values()));

                count += tenderIndicatorsCommonInfoMap.size();

                log.info("{} tenders uploaded from monitoring", count);

                skip += limit;
            } while (skip < tenderOuterIds.size());

            log.info("elasticsearch monitoring integration finished");
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }

    private void provideBasedOnQueue(Map<String, MonitoringEntity> tendersMonitoringMap, Map<String, Boolean> tendersTopMap) {
        log.info("elasticsearch queue integration started");

        try {
            try {
                log.info("Update 'inQueue' field for all documents started");
                elasticsearchDataUpload.updateInQueueForAllItems();
                log.info("Update 'inQueue' completed");
            } catch (Exception e) {
                log.error("Update 'inQueue' not completed");
                log.error(e.getMessage(), e);
            }

            Set<String> tenderOuterIds = tendersTopMap.keySet();

            int count = 0;
            int skip = 0;
            int limit = 1000;

            do {
                log.info("map tender indicator info start");

                Map<String, TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfoMap = tenderOuterIds
                        .stream()
                        .skip(skip)
                        .limit(limit)
                        .collect(Collectors.toMap(
                                tenderId -> tenderId,
                                tenderId -> TenderIndicatorsCommonInfo.builder()
                                        .tenderRiskScore(0d)
                                        .tenderOuterId(tenderId)
                                        .indicators(new HashSet<>())
                                        .indicatorsWithRisk(new HashSet<>())
                                        .indicatorsWithOutRisk(new HashSet<>())
                                        .inQueue(true)
                                        .hasPriorityStatus(tendersTopMap.getOrDefault(tenderId, false))
                                        .build()
                                )
                        );

                fillMonitoringInfo(tenderIndicatorsCommonInfoMap, tendersMonitoringMap);
                fillIndicatorsInfo(tenderIndicatorsCommonInfoMap);
                fillTenderInfo(tenderIndicatorsCommonInfoMap);
                fillProcedureLogType(tenderIndicatorsCommonInfoMap);
                elasticsearchDataUpload.uploadItems(new ArrayList<>(tenderIndicatorsCommonInfoMap.values()));

                count += tenderIndicatorsCommonInfoMap.size();

                log.info("{} tenders uploaded from queue", count);

                skip += limit;
            } while (skip < tenderOuterIds.size());

            log.info("elasticsearch queue integration finished");
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }

    @Scheduled(fixedDelayString = "${elastic.scheduling.delay:600000}")
    public void update() {
        if (elasticTasksEnabled) {
            Map<String, MonitoringEntity> tendersMonitoringMap = getMonitoringsMap();
            Map<String, Boolean> tendersTopMap = getTopTendersMap();

            provide(elasticUpdateInterval, tendersMonitoringMap, tendersTopMap);
            provideBasedOnMonitoring(tendersMonitoringMap, tendersTopMap);
            provideBasedOnQueue(tendersMonitoringMap, tendersTopMap);
        }
    }

    public void init() {
        if (elasticTasksEnabled) {
            Map<String, MonitoringEntity> tendersMonitoringMap = getMonitoringsMap();
            Map<String, Boolean> tendersTopMap = getTopTendersMap();

            provide(elasticInitInterval, tendersMonitoringMap, tendersTopMap);
        }
    }
}
