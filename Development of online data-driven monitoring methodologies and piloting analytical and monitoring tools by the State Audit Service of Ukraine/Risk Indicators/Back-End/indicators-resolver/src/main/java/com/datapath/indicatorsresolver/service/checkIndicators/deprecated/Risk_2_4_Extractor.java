package com.datapath.indicatorsresolver.service.checkIndicators.deprecated;

import com.datapath.indicatorsresolver.model.TenderDimensions;
import com.datapath.indicatorsresolver.model.TenderIndicator;
import com.datapath.indicatorsresolver.service.checkIndicators.BaseExtractor;
import com.datapath.persistence.entities.Indicator;
import lombok.extern.slf4j.Slf4j;

import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import static java.util.Objects.isNull;

@Slf4j
@Deprecated
public class Risk_2_4_Extractor extends BaseExtractor {

    private final String INDICATOR_CODE = "RISK2-4";
    private boolean indicatorsResolverAvailable;


    public Risk_2_4_Extractor() {
        indicatorsResolverAvailable = true;
    }


    public void checkIndicator(ZonedDateTime dateTime) {
        try {
            indicatorsResolverAvailable = false;
            Indicator indicator = getIndicator(INDICATOR_CODE);
            if (indicator.isActive() && tenderRepository.findMaxDateModified().isAfter(ZonedDateTime.now().minusHours(AVAILABLE_HOURS_DIFF))) {
                checkRisk2_4Indicator(indicator, dateTime);
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        } finally {
            indicatorsResolverAvailable = true;
        }
    }

    public void checkIndicator() {
        if (!indicatorsResolverAvailable) {
            log.info(String.format(INDICATOR_NOT_AVAILABLE_MESSAGE_FORMAT, INDICATOR_CODE));
            return;
        }
        try {
            indicatorsResolverAvailable = false;
            Indicator indicator = getIndicator(INDICATOR_CODE);
            if (indicator.isActive() && tenderRepository.findMaxDateModified().isAfter(ZonedDateTime.now().minusHours(AVAILABLE_HOURS_DIFF))) {
                ZonedDateTime dateTime = isNull(indicator.getLastCheckedDateCreated())
                        ? ZonedDateTime.now(ZoneId.of("UTC")).minus(Period.ofYears(1)).withHour(0)
                        : indicator.getLastCheckedDateCreated();
                checkRisk2_4Indicator(indicator, dateTime);
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        } finally {
            indicatorsResolverAvailable = true;
        }
    }

    private void checkRisk2_4Indicator(Indicator indicator, ZonedDateTime dateTime) {
        log.info("{} indicator started", INDICATOR_CODE);
        while (true) {

            List<String> tenders = findTenders(
                    dateTime,
                    Arrays.asList(indicator.getProcedureStatuses()),
                    Arrays.asList(indicator.getProcedureTypes()),
                    Arrays.asList(indicator.getProcuringEntityKind()));

            if (tenders.isEmpty()) {
                break;
            }

            Map<String, TenderDimensions> dimensionsMap = getTenderDimensionsWithIndicatorLastIteration(new HashSet<>(tenders), INDICATOR_CODE);

            Map<String, Long> maxTendersIndicatorIteration = extractDataService
                    .getMaxTenderIndicatorIteration(new HashSet<>(tenders), INDICATOR_CODE);

            Map<String, Integer> maxTendersIterationData = extractDataService
                    .getMaxTendersIterationData(maxTendersIndicatorIteration, INDICATOR_CODE);

            String tenderIdsStr = String.join(",", tenders);
            for (Object[] tenderInfo : tenderRepository.getDistinctLotUnsuccessfulAndAwardsAndSupplierCount(tenderIdsStr)) {
                String tenderId = tenderInfo[0].toString();

                log.info("Process tender {}", tenderId);

                try {
                    Integer lotCount = Integer.parseInt(tenderInfo[1].toString());
                    Integer unsuccessfulSuppliersCount = Integer.parseInt(tenderInfo[2].toString());
                    Integer supplierCount = Integer.parseInt(tenderInfo[3].toString());
                    Integer indicatorValue;

                    if (maxTendersIterationData.containsKey(tenderId) && maxTendersIterationData.get(tenderId) == 1){
                        indicatorValue = RISK;
                    } else {
                        if (lotCount < 5 || unsuccessfulSuppliersCount == 0) {
                            indicatorValue = CONDITIONS_NOT_MET;
                        } else {
                            indicatorValue = supplierCount == 1 ? RISK : NOT_RISK;
                        }
                    }
                    TenderDimensions tenderDimensions = dimensionsMap.get(tenderId);
                    TenderIndicator tenderIndicator = new TenderIndicator(tenderDimensions, indicator, indicatorValue, new ArrayList<>());
                    uploadIndicatorIfNotExists(tenderId, INDICATOR_CODE, tenderIndicator);
                } catch (Exception ex) {
                    log.error(String.format(TENDER_INDICATOR_ERROR_MESSAGE, INDICATOR_CODE, tenderId));
                    log.error(ex.getMessage(), ex);
                }
            }

            ZonedDateTime maxTenderDateCreated = getMaxTenderDateCreated(dimensionsMap, dateTime);
            indicator.setLastCheckedDateCreated(maxTenderDateCreated);
            indicatorRepository.save(indicator);

            dateTime = maxTenderDateCreated;
        }
        ZonedDateTime now = ZonedDateTime.now();
        indicator.setDateChecked(now);
        indicatorRepository.save(indicator);

        log.info("{} indicator finished", INDICATOR_CODE);
    }
}
