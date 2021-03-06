package com.datapath.indicatorsresolver.service.checkIndicators;

import com.datapath.indicatorsresolver.model.TenderDimensions;
import com.datapath.indicatorsresolver.model.TenderIndicator;
import com.datapath.persistence.entities.Indicator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import static com.datapath.persistence.utils.DateUtils.toZonedDateTime;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.joining;


@Service
@Slf4j
public class Risk_1_4_1_Extractor extends BaseExtractor {

    /*
    Перевищення строку розгляду тендерної пропозиції переможця (більше 5 днів)
    */

    private final String INDICATOR_CODE = "RISK1-4_1";
    private final Integer DAYS_LIMIT = 5;

    private boolean indicatorsResolverAvailable;

    public Risk_1_4_1_Extractor() {
        indicatorsResolverAvailable = true;
    }


    public void checkIndicator(ZonedDateTime dateTime) {
        try {
            indicatorsResolverAvailable = false;
            Indicator indicator = getActiveIndicator(INDICATOR_CODE);
            if (nonNull(indicator) && tenderRepository.findMaxDateModified().isAfter(ZonedDateTime.now().minusHours(AVAILABLE_HOURS_DIFF))) {
                checkRisk_1_4_1_Indicator(indicator, dateTime);
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
            Indicator indicator = getActiveIndicator(INDICATOR_CODE);
            if (nonNull(indicator) && tenderRepository.findMaxDateModified().isAfter(ZonedDateTime.now().minusHours(AVAILABLE_HOURS_DIFF))) {
                ZonedDateTime dateTime = isNull(indicator.getLastCheckedDateCreated())
                        ? ZonedDateTime.now().minus(Period.ofYears(1)).withHour(0)
                        : indicator.getLastCheckedDateCreated();
                checkRisk_1_4_1_Indicator(indicator, dateTime);
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        } finally {
            indicatorsResolverAvailable = true;
        }
    }


    private void checkRisk_1_4_1_Indicator(Indicator indicator, ZonedDateTime dateTime) {
        int size = 100;
        int page = 0;
        while (true) {
            log.info("Start finding tenders after [{}]", dateTime.toString());
            List<String> tenders = findTenders(
                    dateTime,
                    Arrays.asList(indicator.getProcedureStatuses()),
                    Arrays.asList(indicator.getProcedureTypes()),
                    Arrays.asList(indicator.getProcuringEntityKind()),
                    page, size);

            log.info("Finish finding tenders. Found [{}] tenders", tenders.size());
            if (tenders.isEmpty()) {
                break;
            }

            Map<String, TenderDimensions> dimensionsMap = getTenderDimensionsWithIndicatorLastIteration(new HashSet<>(tenders), INDICATOR_CODE);

            Map<String, List<TenderIndicator>> tenderIndicatorsMap = checkIndicator(tenders, indicator);
            tenderIndicatorsMap.forEach((tenderId, tenderIndicators) -> {
                tenderIndicators.forEach(tenderIndicator -> tenderIndicator.setTenderDimensions(dimensionsMap.get(tenderId)));
                uploadIndicators(tenderIndicators, dimensionsMap.get(tenderId).getDruidCheckIteration());
            });

            ZonedDateTime maxTenderDateCreated = getMaxTenderDateCreated(dimensionsMap, dateTime);
            indicator.setLastCheckedDateCreated(maxTenderDateCreated);
            indicatorRepository.save(indicator);

            dateTime = maxTenderDateCreated;
        }
        ZonedDateTime now = ZonedDateTime.now();
        indicator.setDateChecked(now);
        indicatorRepository.save(indicator);

    }


    private Map<String, List<TenderIndicator>> checkIndicator(List<String> tenderIds, Indicator indicator) {
        Map<String, Map<Integer, List<String>>> resultMap = new HashMap<>();
        Map<String, List<TenderIndicator>> result = new HashMap<>();


        Map<String, Long> maxTendersIndicatorIteration = extractDataService
                .getMaxTenderIndicatorIteration(new HashSet<>(tenderIds), INDICATOR_CODE);

        Map<String, Map<String, Integer>> maxTendersLotIterationData = extractDataService
                .getMaxTendersLotIterationData(maxTendersIndicatorIteration, INDICATOR_CODE);


        List<Object[]> tenderLotdateDocComplaintCount = tenderRepository
                .getTenderLotDateNoSignatureDocComplaintCountByTenderIds(tenderIds.stream().collect(joining(",")));

        ZonedDateTime dateOfCurrentDateMinusNWorkingDays = getDateOfCurrentDateMinusNWorkingDays(DAYS_LIMIT);

        tenderLotdateDocComplaintCount.forEach(tenderLotData -> {
            String tenderId = tenderLotData[0].toString();

            String lotId = tenderLotData[1].toString();
            Object awardIdObj = tenderLotData[2];
            Timestamp awardDateTimestamp = (Timestamp) tenderLotData[3];
            int docCount = Integer.parseInt(tenderLotData[4].toString());
            int complaintsCount = Integer.parseInt(tenderLotData[5].toString());

            int indicatorValue;

            if (maxTendersLotIterationData.get(tenderId).containsKey(lotId) && maxTendersLotIterationData.get(tenderId).get(lotId).equals(1)) {
                indicatorValue = 1;
            } else {
                if (isNull(awardIdObj)) {
                    indicatorValue = 0;
                } else {
                    ZonedDateTime awardDate = toZonedDateTime(awardDateTimestamp).withZoneSameInstant(ZoneId.of("Europe/Kiev"))
                            .withHour(0)
                            .withMinute(0)
                            .withSecond(0)
                            .withNano(0);
                    indicatorValue = (!awardDate.isBefore(dateOfCurrentDateMinusNWorkingDays)
                            || docCount > 0 || complaintsCount > 0)
                            ? -2
                            : 1;
                }
            }

            if (!resultMap.containsKey(tenderId)) {
                resultMap.put(tenderId, new HashMap<>());
            }
            if (!resultMap.get(tenderId).containsKey(indicatorValue)) {
                resultMap.get(tenderId).put(indicatorValue, new ArrayList<>());
            }
            resultMap.get(tenderId).get(indicatorValue).add(lotId);

        });

        resultMap.forEach((tenderOuterId, value) -> {
            TenderDimensions tenderDimensions = new TenderDimensions(tenderOuterId);
            value.forEach((indicatorValue, lots) -> {
                if (!result.containsKey(tenderOuterId)) result.put(tenderOuterId, new ArrayList<>());
                result.get(tenderOuterId).add(new TenderIndicator(tenderDimensions, indicator, indicatorValue, lots));
            });
        });

        return result;
    }
}
