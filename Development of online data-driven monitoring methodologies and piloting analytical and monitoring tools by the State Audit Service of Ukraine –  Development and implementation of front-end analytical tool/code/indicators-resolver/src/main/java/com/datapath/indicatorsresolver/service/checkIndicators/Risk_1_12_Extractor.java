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


@Service
@Slf4j
public class Risk_1_12_Extractor extends BaseExtractor {

    /*
    Запізніла відповідь на звернення за роз'ясненнями - З
    амовник протягом трьох робочих днів з дня оприлюднення звернення щодо надання роз'яснення змісту тендерної
    документації не надав відповідь на звернення
    */

    private final String INDICATOR_CODE = "RISK1-12";

    private boolean indicatorsResolverAvailable;

    public Risk_1_12_Extractor() {
        indicatorsResolverAvailable = true;
    }

    public void checkIndicator(ZonedDateTime dateTime) {
        try {
            indicatorsResolverAvailable = false;
            Indicator indicator = getActiveIndicator(INDICATOR_CODE);
            if (nonNull(indicator) && tenderRepository.findMaxDateModified().isAfter(ZonedDateTime.now().minusHours(AVAILABLE_HOURS_DIFF))) {
                checkRisk1_12Indicator(indicator, dateTime);
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
                        ? ZonedDateTime.now(ZoneId.of("UTC")).minus(Period.ofYears(1)).withHour(0)
                        : indicator.getLastCheckedDateCreated();
                checkRisk1_12Indicator(indicator, dateTime);
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        } finally {
            indicatorsResolverAvailable = true;
        }
    }


    private void checkRisk1_12Indicator(Indicator indicator, ZonedDateTime dateTime) {
        int size = 100;
        int page = 0;
        while (true) {

            List<String> tenders = findTenders(
                    dateTime,
                    Arrays.asList(indicator.getProcedureStatuses()),
                    Arrays.asList(indicator.getProcedureTypes()),
                    Arrays.asList(indicator.getProcuringEntityKind()),
                    page, size
            );

            if (tenders.isEmpty()) {
                break;
            }

            Map<String, TenderDimensions> dimensionsMap = getTenderDimensionsWithIndicatorLastIteration(new HashSet<>(tenders), INDICATOR_CODE);
            Map<String, TenderIndicator> tenderIndicatorMap = checkIndicator(tenders, indicator);

            tenderIndicatorMap.forEach((tenderId, tenderIndicator) -> {
                tenderIndicator.setTenderDimensions(dimensionsMap.get(tenderId));
                uploadIndicatorIfNotExists(tenderId, INDICATOR_CODE, tenderIndicator);
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

    private Map<String, TenderIndicator> checkIndicator(List<String> tenderIds, Indicator indicator) {
        String tenderIdsStr = String.join(",", tenderIds);
        List<Object> questionDateDateAnswerAndAnswerOrderByTenderIdIn = questionRepository
                .getQuestionDateDateAnswerAndAnswerOrderByTenderIdIn(tenderIdsStr);

        Map<String, Long> maxTendersIndicatorIteration = extractDataService
                .getMaxTenderIndicatorIteration(new HashSet<>(tenderIds), INDICATOR_CODE);

        Map<String, Integer> maxTendersIterationData = extractDataService
                .getMaxTendersIterationData(maxTendersIndicatorIteration, INDICATOR_CODE);


        Map<String, List<Object>> tendersMap = new HashMap<>();
        for (Object obj : questionDateDateAnswerAndAnswerOrderByTenderIdIn) {
            Object[] objs = (Object[]) obj;
            String tenderId = objs[0].toString();
            List<Object> answersInfo = tendersMap.get(tenderId);
            if (null != answersInfo) {
                answersInfo.add(obj);
            } else {
                answersInfo = new ArrayList<>();
                answersInfo.add(obj);
                tendersMap.put(tenderId, answersInfo);
            }
        }


        Map<String, TenderIndicator> indicatorsMap = new HashMap<>();
        for (String tenderId : tendersMap.keySet()) {
            TenderDimensions tenderDimensions = new TenderDimensions(tenderId);

            Integer indicatorValue = null;

            if (maxTendersIterationData.containsKey(tenderId) && maxTendersIterationData.get(tenderId) == 1) {
                indicatorValue = 1;
            } else {

                List<Object> questionDateDateAnswerAndAnswerOrderByTenderID = tendersMap.get(tenderId);

                for (Object answer : questionDateDateAnswerAndAnswerOrderByTenderID) {
                    Integer questionIndicator;

                    Object[] answerInfo = (Object[]) answer;

                    Long questionId = answerInfo[1] == null ? null : Long.parseLong(answerInfo[1].toString());
                    Integer days = answerInfo[5] == null ? null : ((Double) Double.parseDouble(answerInfo[5].toString())).intValue();

                    if (null == questionId || null == days || days < 10) {
                        questionIndicator = -2;
                    } else {

                        Timestamp timestampDateAnswered = (Timestamp) answerInfo[2];
                        Timestamp timestampQuestionDate = (Timestamp) answerInfo[4];
                        Object answerText = answerInfo[1];

                        if (isNull(timestampDateAnswered) && isNull(answerText)) {
                            ZonedDateTime dateOfCurrentDateMinusNWorkingDays = getDateOfCurrentDateMinusNWorkingDays(4);
                            questionIndicator = toZonedDateTime(timestampQuestionDate).withZoneSameInstant(ZoneId.of("Europe/Kiev"))
                                    .withHour(0)
                                    .withMinute(0)
                                    .withSecond(0)
                                    .withNano(0)
                                    .isBefore(dateOfCurrentDateMinusNWorkingDays)
                                    ? RISK
                                    : NOT_RISK;
                        } else if (nonNull(timestampDateAnswered) && nonNull(answerText)) {
                            ZonedDateTime dateOfCurrentDateMinusNWorkingDays = getDateOfDateMinusNWorkingDays(toZonedDateTime(timestampDateAnswered), 4);
                            questionIndicator = toZonedDateTime(timestampQuestionDate).withZoneSameInstant(ZoneId.of("Europe/Kiev"))
                                    .withHour(0)
                                    .withMinute(0)
                                    .withSecond(0)
                                    .withNano(0)
                                    .isBefore(dateOfCurrentDateMinusNWorkingDays)
                                    ? RISK
                                    : NOT_RISK;
                        } else {
                            questionIndicator = -2;
                        }
                    }
                    if (questionIndicator.equals(RISK)) {
                        indicatorValue = RISK;
                        break;
                    } else {
                        if (isNull(indicatorValue) || indicatorValue.equals(-2)) {
                            indicatorValue = questionIndicator;
                        }
                    }
                }
            }
            indicatorsMap.put(tenderId, new TenderIndicator(tenderDimensions, indicator, indicatorValue, new ArrayList<>()));

        }

        return indicatorsMap;
    }
}