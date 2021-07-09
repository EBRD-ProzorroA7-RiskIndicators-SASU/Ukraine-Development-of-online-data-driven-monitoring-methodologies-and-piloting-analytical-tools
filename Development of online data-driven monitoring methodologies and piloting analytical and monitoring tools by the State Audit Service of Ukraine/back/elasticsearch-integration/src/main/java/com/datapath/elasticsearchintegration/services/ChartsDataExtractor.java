package com.datapath.elasticsearchintegration.services;

import com.datapath.elasticsearchintegration.constants.Aggregations;
import com.datapath.elasticsearchintegration.constants.Constants;
import com.datapath.elasticsearchintegration.constants.ProcedureProperty;
import com.datapath.elasticsearchintegration.domain.FilterQuery;
import com.datapath.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.elasticsearchintegration.domain.charts.DynamicChartData;
import com.datapath.elasticsearchintegration.domain.charts.KPICharts;
import com.datapath.elasticsearchintegration.domain.charts.TopRegion;
import com.datapath.elasticsearchintegration.util.Mapping;
import com.datapath.persistence.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.BucketOrder;
import org.elasticsearch.search.aggregations.bucket.filter.ParsedFilter;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogramInterval;
import org.elasticsearch.search.aggregations.bucket.histogram.Histogram;
import org.elasticsearch.search.aggregations.bucket.histogram.ParsedDateHistogram;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedStringTerms;
import org.elasticsearch.search.aggregations.metrics.ParsedSum;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.datapath.elasticsearchintegration.constants.Constants.DATE_FORMAT;
import static com.datapath.persistence.utils.DateUtils.formatToString;
import static java.time.temporal.TemporalAdjusters.nextOrSame;
import static java.time.temporal.TemporalAdjusters.previousOrSame;

@Slf4j
@Service
public class ChartsDataExtractor extends BaseDataExtractor {

    private final RestHighLevelClient client;

    private final ProcedureFilterService filterService;

    @Autowired
    public ChartsDataExtractor(RestHighLevelClient client, ProcedureFilterService filterService) {
        this.client = client;
        this.filterService = filterService;
    }

    KPICharts proceduresCountMonthly() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.dateHistogram(Aggregations.DAYS.value())
                        .calendarInterval(DateHistogramInterval.MONTH)
                        .field(ProcedureProperty.DATE_PUBLISHED.value())
                        .order(BucketOrder.key(true))
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_RISK_COUNT.value(), QueryBuilders.rangeQuery(ProcedureProperty.TENDER_RISK_SCORE.value()).gt(0))
                                .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()))
                                .subAggregation(AggregationBuilders.filter(Aggregations.MONITORING_STATUS.value(),
                                        QueryBuilders.termQuery(ProcedureProperty.MONITORING_STATUS_KEYWORD.value(), "addressed"))
                                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()))
                                )
                        )
                );

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        Date yearAgo = find12MonthAgoDate();
        Date lastMonth = findLastWholeMonthDate();
        applyDateRange(DateUtils.formatToString(yearAgo, DATE_FORMAT), DateUtils.formatToString(lastMonth, DATE_FORMAT), boolQuery);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        try {
            applyDateRange(DateUtils.formatToString(format.parse("2018-10-01"), DATE_FORMAT), DateUtils.formatToString(lastMonth, DATE_FORMAT), boolQuery);
        } catch (ParseException e) {
            log.error(e.getMessage(), e);
        }
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        KPICharts kpiCharts = new KPICharts();

        ((ParsedDateHistogram) searchResponse.getAggregations()
                .get(Aggregations.DAYS.value())).getBuckets()
                .forEach(bucket -> {
                    kpiCharts.getDates().add(bucket.getKeyAsString());
                    kpiCharts.getProceduresCount().add(bucket.getDocCount());
                    double proceduresAmount = ((ParsedSum) bucket.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue();
                    kpiCharts.getProceduresAmount().add(proceduresAmount);
                    kpiCharts.getRiskedProceduresCount().add((((ParsedFilter) bucket.getAggregations().get(Aggregations.WITH_RISK_COUNT.value())).getDocCount()));
                    double riskedProceduresAmount = ((ParsedSum) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_RISK_COUNT.value())))
                            .getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue();
                    kpiCharts.getRiskedProceduresAmount().add(riskedProceduresAmount);
                    kpiCharts.getAddressedProceduresAmount().add(((ParsedSum) ((ParsedFilter) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_RISK_COUNT.value())))
                            .getAggregations().get(Aggregations.MONITORING_STATUS.value())).getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue());
                    try {
                        kpiCharts.getPartsRiskedProcedures().add(riskedProceduresAmount / proceduresAmount * 100);
                    } catch (Exception e) {
                        log.error("Failed to calculate parts risked procedures", e);
                    }
                });
        return kpiCharts;
    }

    List<DynamicChartData> getDynamicOfGrowingProceduresAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.dateHistogram(Aggregations.DAYS.value())
                        .calendarInterval(DateHistogramInterval.WEEK)
                        .field(ProcedureProperty.DATE_PUBLISHED.value())
                        .order(BucketOrder.key(true))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_RISK_COUNT.value(), QueryBuilders.rangeQuery(ProcedureProperty.TENDER_RISK_SCORE.value()).gt(0))
                                .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value())))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_PRIORITY_COUNT.value(), QueryBuilders.termQuery(ProcedureProperty.HAS_PRIORITY_STATUS.value(), true))
                                .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value())))
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()))
                );

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        Date firstMonday = findFirstMonday(filterQuery.getStartDate(), filterQuery.getEndDate());
        Date lastSunday = findLastSunday(filterQuery.getStartDate(), filterQuery.getEndDate());
        applyDateRange(DateUtils.formatToString(firstMonday, DATE_FORMAT), DateUtils.formatToString(lastSunday, DATE_FORMAT), boolQuery);

        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedDateHistogram) searchResponse.getAggregations()
                .get(Aggregations.DAYS.value())).getBuckets()
                .stream()
                .map(this::parseAggregationItemToDynamicChartDataAmount).collect(Collectors.toList());
    }

    private DynamicChartData parseAggregationItemToDynamicChartDataAmount(Histogram.Bucket bucket) {
        Date date = Date.from(((ZonedDateTime) bucket.getKey()).toInstant());
        Double totalProcedures = ((ParsedSum) bucket.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue();
        Double countWithRisk = ((ParsedSum) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_RISK_COUNT.value()))).getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue();
        Double countWithPriority = ((ParsedSum) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_PRIORITY_COUNT.value()))).getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue();

        return DynamicChartData.builder()
                .date(date)
                .dateAsString(formatToString(date, Constants.DATE_FORMAT))
                .totalCount(totalProcedures)
                .countWithRisk(countWithRisk)
                .countWithPriority(countWithPriority)
                .countWithoutPriority(totalProcedures - countWithPriority).build();
    }

    List<DynamicChartData> getDynamicOfGrowingProceduresCount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.dateHistogram(Aggregations.DAYS.value())
                        .calendarInterval(DateHistogramInterval.WEEK)
                        .field(ProcedureProperty.DATE_PUBLISHED.value())
                        .order(BucketOrder.key(true))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_RISK_COUNT.value(), QueryBuilders.rangeQuery(ProcedureProperty.TENDER_RISK_SCORE.value()).gt(0)))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_PRIORITY_COUNT.value(), QueryBuilders.termQuery(ProcedureProperty.HAS_PRIORITY_STATUS.value(), true)))
                );
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);

        Date firstMonday = findFirstMonday(filterQuery.getStartDate(), filterQuery.getEndDate());
        Date lastSunday = findLastSunday(filterQuery.getStartDate(), filterQuery.getEndDate());
        applyDateRange(DateUtils.formatToString(firstMonday, DATE_FORMAT), DateUtils.formatToString(lastSunday, DATE_FORMAT), boolQuery);

        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedDateHistogram) searchResponse.getAggregations()
                .get(Aggregations.DAYS.value())).getBuckets()
                .stream()
                .map(this::parseAggregationItemToDynamicChartData).collect(Collectors.toList());
    }

    private DynamicChartData parseAggregationItemToDynamicChartData(Histogram.Bucket bucket) {
        Date date = Date.from(((ZonedDateTime) bucket.getKey()).toInstant());
        Double totalProcedures = ((double) bucket.getDocCount());
        Double countWithRisk = ((double) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_RISK_COUNT.value()))).getDocCount());
        Double countWithPriority = ((double) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_PRIORITY_COUNT.value()))).getDocCount());

        return DynamicChartData.builder()
                .date(date)
                .dateAsString(formatToString(date, Constants.DATE_FORMAT))
                .totalCount(totalProcedures)
                .countWithRisk(countWithRisk)
                .countWithPriority(countWithPriority)
                .countWithoutPriority(totalProcedures - countWithPriority).build();
    }

    List<KeyValueObject> getProceduresGroupByPurchaseMethod(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCEDURES.value()).field(ProcedureProperty.PROCEDURE_TYPE_KEYWORD.value()).order(BucketOrder.key(false)));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.PROCEDURES.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getProceduresGroupByPurchaseMethodAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCEDURES.value()).field(ProcedureProperty.PROCEDURE_TYPE_KEYWORD.value()).order(BucketOrder.key(false))
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.PROCEDURES.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue()))
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getTop10ProcuringEntity(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCURING_ENTITY_KIND.value())
                        .field(ProcedureProperty.PROCURING_ENTITY_NAME_KEYWORD.value())
                        .order(BucketOrder.count(false)).size(10));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.PROCURING_ENTITY_KIND.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getTop10ProcuringEntityAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCURING_ENTITY_KIND.value())
                        .field(ProcedureProperty.PROCURING_ENTITY_NAME_KEYWORD.value()).order(BucketOrder.aggregation(Aggregations.AMOUNT_OF_RISK.value(), false))
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.PROCURING_ENTITY_KIND.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue()))
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getTop10Cpv(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.CPV_NAME.value())
                        .field(ProcedureProperty.CPV_NAME_KEYWORD.value())
                        .order(BucketOrder.count(false)).size(10));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.CPV_NAME.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getTop10CpvAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.CPV_NAME.value())
                        .field(ProcedureProperty.CPV_NAME_KEYWORD.value()).order(BucketOrder.aggregation(Aggregations.AMOUNT_OF_RISK.value(), false))
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.CPV_NAME.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue()))
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getTop10RiskIndicators(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.RISK_INDICATORS.value()).field(ProcedureProperty.INDICATORS_WITH_RISK_KEYWORD.value()).size(10).order(BucketOrder.count(false)));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.RISK_INDICATORS.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getTop10RiskIndicatorsAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.RISK_INDICATORS_AMOUNT.value()).field(ProcedureProperty.INDICATORS_WITH_RISK_KEYWORD.value())
                        .size(10)
                        .order(BucketOrder.aggregation(Aggregations.AMOUNT_OF_RISK.value(), false))
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.RISK_INDICATORS_AMOUNT.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue()))
                .collect(Collectors.toList());
    }

    List<TopRegion> getTop10RegionByRiskProcedureCount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCURING_ENTITY_KIND.value())
                        .field(ProcedureProperty.REGION_KEYWORD.value())
                        .order(BucketOrder.count(false))
                        .size(10)
                        .subAggregation(
                                AggregationBuilders
                                        .filter(Aggregations.WITH_PRIORITY_COUNT.value(),
                                                QueryBuilders.termQuery(ProcedureProperty.HAS_PRIORITY_STATUS.value(), true))
                        ));

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations()
                .get(Aggregations.PROCURING_ENTITY_KIND.value()))
                .getBuckets()
                .stream()
                .map(bucket -> {
                    long prioritized = ((ParsedFilter) bucket.getAggregations().get(Aggregations.WITH_PRIORITY_COUNT.value())).getDocCount();
                    return new TopRegion(bucket.getKeyAsString(), (double) bucket.getDocCount(), (double) prioritized);
                })
                .collect(Collectors.toList());
    }

    List<TopRegion> getTop10RegionByRiskProcedureAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.REGION_AMOUNT.value())
                        .field(ProcedureProperty.REGION_KEYWORD.value())
                        .size(10)
                        .order(BucketOrder.aggregation(Aggregations.AMOUNT_OF_RISK.value(), false))
                        .subAggregation(
                                AggregationBuilders
                                        .filter(Aggregations.WITH_PRIORITY_COUNT.value(),
                                                QueryBuilders.termQuery(ProcedureProperty.HAS_PRIORITY_STATUS.value(), true))
                                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()))
                        )
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value())));

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations().get(Aggregations.REGION_AMOUNT.value())).getBuckets().stream().map(bucket -> {
            bucket.getKeyAsString();
            return new TopRegion(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get("amountOfRisc")).getValue(),
                    ((ParsedSum) ((ParsedFilter) bucket.getAggregations().get("prioritized")).getAggregations().asList().get(0)).getValue());
        }).collect(Collectors.toList());
    }

    List<KeyValueObject> getProcedureByRiskTable(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCEDURE_TYPE.value())
                        .field(ProcedureProperty.PROCEDURE_TYPE_KEYWORD.value())
                        .size(10)
                        .subAggregation(
                                AggregationBuilders.terms(Aggregations.WITH_PRIORITY_COUNT.value())
                                        .field(ProcedureProperty.INDICATORS_WITH_RISK_KEYWORD.value())
                                        .size(100)
                                        .minDocCount(0)
                                        .order(BucketOrder.key(true))
                        )
                );

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations()
                .get(Aggregations.PROCEDURE_TYPE.value()))
                .getBuckets()
                .stream()
                .map(bucket -> {
                    String procedureType = bucket.getKeyAsString();
                    List<KeyValueObject> risks = ((ParsedStringTerms) bucket.getAggregations().get(Aggregations.WITH_PRIORITY_COUNT.value())).getBuckets()
                            .stream()
                            .map(subBucket -> {
                                if (CollectionUtils.contains(Mapping.RISK_INDICATORS_PROCEDURES.get(subBucket.getKeyAsString()).iterator(), procedureType)) {
                                    return new KeyValueObject(new KeyValueObject(subBucket.getKeyAsString(), Mapping.RISK_INDICATORS.get(subBucket.getKeyAsString())), subBucket.getDocCount());
                                } else {
                                    return new KeyValueObject(new KeyValueObject(subBucket.getKeyAsString(), Mapping.RISK_INDICATORS.get(subBucket.getKeyAsString())), "X");
                                }
                            }).collect(Collectors.toList());

                    return new KeyValueObject(procedureType, risks);
                })
                .collect(Collectors.toList());
    }

    List<KeyValueObject> getProcedureByRiskTableAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCEDURE_TYPE.value())
                        .field(ProcedureProperty.PROCEDURE_TYPE_KEYWORD.value())
                        .size(10)
                        .subAggregation(
                                AggregationBuilders.terms(Aggregations.WITH_PRIORITY_COUNT.value())
                                        .field(ProcedureProperty.INDICATORS_WITH_RISK_KEYWORD.value())
                                        .size(100)
                                        .minDocCount(0)
                                        .order(BucketOrder.key(true))
                                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()))
                        )
                );

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations()
                .get(Aggregations.PROCEDURE_TYPE.value()))
                .getBuckets()
                .stream()
                .map(bucket -> {
                    String procedureType = bucket.getKeyAsString();
                    List<KeyValueObject> risks = ((ParsedStringTerms) bucket.getAggregations().get(Aggregations.WITH_PRIORITY_COUNT.value())).getBuckets()
                            .stream()
                            .map(subBucket -> {
                                KeyValueObject key = new KeyValueObject(subBucket.getKeyAsString(), Mapping.RISK_INDICATORS.get(subBucket.getKeyAsString()));
                                if (CollectionUtils.contains(Mapping.RISK_INDICATORS_PROCEDURES.get(subBucket.getKeyAsString()).iterator(), procedureType)) {
                                    return new KeyValueObject(key, ((ParsedSum) subBucket.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue());
                                } else {
                                    return new KeyValueObject(key, "X");
                                }
                            }).collect(Collectors.toList());
                    return new KeyValueObject(procedureType, risks);
                })
                .collect(Collectors.toList());
    }

    private static Date findLastSunday(Date dateStart, Date dateEnd) {
        ZoneId defaultZoneId = ZoneId.systemDefault();
        LocalDate resultDateTime = dateEnd.toInstant().atZone(defaultZoneId).toLocalDate().with(previousOrSame(DayOfWeek.SUNDAY));
        Date resultDate = Date.from(resultDateTime.atStartOfDay(ZoneId.systemDefault()).toInstant());
        if (resultDate.before(dateStart)) {
            return dateEnd;
        }
        return resultDate;
    }

    private static Date findFirstMonday(Date dateStart, Date dateEnd) {
        ZoneId defaultZoneId = ZoneId.systemDefault();
        LocalDate resultDateTime = dateStart.toInstant().atZone(defaultZoneId).toLocalDate().with(nextOrSame(DayOfWeek.MONDAY));
        Date resultDate = Date.from(resultDateTime.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date lastSunday = findLastSunday(dateStart, dateEnd);
        if (resultDate.before(lastSunday)) {
            return resultDate;
        }
        return dateStart;
    }

    private static Date find12MonthAgoDate() {
        LocalDate currentMonthDate = LocalDate.now().withDayOfMonth(1);
        return Date.from(currentMonthDate.minusMonths(12).atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    private static Date findLastWholeMonthDate() {
        return Date.from(LocalDate.now().withDayOfMonth(1).minusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
