package com.datapath.elasticsearchintegration.services;

import com.datapath.elasticsearchintegration.constants.Aggregations;
import com.datapath.elasticsearchintegration.constants.ProcedureProperty;
import com.datapath.elasticsearchintegration.domain.FilterQuery;
import com.datapath.elasticsearchintegration.domain.KpiInfo;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.metrics.ParsedCardinality;
import org.elasticsearch.search.aggregations.metrics.ParsedSum;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.datapath.elasticsearchintegration.constants.ProcedureProperty.EXPECTED_VALUE;

@Service
public class KpiDataExtractor extends BaseDataExtractor {

    private final ProcedureFilterService filterService;

    private final RestHighLevelClient client;

    @Autowired
    public KpiDataExtractor(RestHighLevelClient client, ProcedureFilterService filterService) {
        this.client = client;
        this.filterService = filterService;
    }

    KpiInfo getData() {
        KpiInfo kpiInfo = new KpiInfo();
        setTotalKpiInfo(kpiInfo);
        setRiskedKpiInfo(kpiInfo);
        setMonitoringKpiInfo(kpiInfo);
        kpiInfo.setRiskProcuringEntitiesCount(countDistinctPEWithRisk());
        kpiInfo.setAllProcuringEntitiesCount(countDistinctPE());
        kpiInfo.setIndicatorsCount(countDistinctIndicators());
        kpiInfo.setRiskIndicatorsCount(countDistinctIndicatorsWithRisk());
        return kpiInfo;
    }

    KpiInfo getDataFiltered(FilterQuery filterQuery) {
        KpiInfo kpiInfo = new KpiInfo();
        setRiskedKpiInfo(kpiInfo, filterQuery);
        setTotalKpiInfo(kpiInfo, filterQuery);
        kpiInfo.setRiskProcuringEntitiesCount(countDistinctPEWithRisk(filterQuery));
        kpiInfo.setAllProcuringEntitiesCount(countDistinctPE(filterQuery));
        kpiInfo.setIndicatorsCount(countDistinctIndicators(filterQuery));
        kpiInfo.setRiskIndicatorsCount(countDistinctIndicatorsWithRisk(filterQuery));
        return kpiInfo;
    }

    private long countDistinctPEWithRisk(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.PROCURING_ENTITY_KIND.value()).field(ProcedureProperty.PROCURING_ENTITY_EDRPOU_KEYWORD.value()));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.PROCURING_ENTITY_KIND.value())).getValue();
    }

    private long countDistinctPEWithRisk() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.PROCURING_ENTITY_KIND.value()).field(ProcedureProperty.PROCURING_ENTITY_EDRPOU_KEYWORD.value()));
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.PROCURING_ENTITY_KIND.value())).getValue();
    }

    private long countDistinctPE() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.PROCURING_ENTITY_KIND.value()).field(ProcedureProperty.PROCURING_ENTITY_EDRPOU_KEYWORD.value()));
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.PROCURING_ENTITY_KIND.value())).getValue();
    }

    private long countDistinctPE(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.PROCURING_ENTITY_KIND.value()).field(ProcedureProperty.PROCURING_ENTITY_EDRPOU_KEYWORD.value()));
        searchSourceBuilder.query(filterService.getBoolQueryWithFilters(filterQuery));
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.PROCURING_ENTITY_KIND.value())).getValue();
    }

    private long countDistinctIndicators(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK.value()).field(ProcedureProperty.INDICATORS_KEYWORD.value()));
        searchSourceBuilder.query(filterService.getBoolQueryWithFilters(filterQuery));
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK.value())).getValue();
    }

    private long countDistinctIndicators() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK.value()).field(ProcedureProperty.INDICATORS_KEYWORD.value()));
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK.value())).getValue();
    }

    private long countDistinctIndicatorsWithRisk(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK.value()).field(ProcedureProperty.INDICATORS_WITH_RISK_KEYWORD.value()));
        searchSourceBuilder.query(filterService.getBoolQueryWithFilters(filterQuery));
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK.value())).getValue();
    }

    private long countDistinctIndicatorsWithRisk() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK.value()).field(ProcedureProperty.INDICATORS_WITH_RISK_KEYWORD.value()));
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK.value())).getValue();
    }

    private SearchRequest getKPI(FilterQuery filterQuery, boolean withRisks) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        if (withRisks) {
            applyRiskFilter(boolQuery);
        }
        searchSourceBuilder.query(boolQuery);
        return searchRequest;
    }

    private SearchRequest getKPI(boolean withRisks) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()));
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        if (withRisks) {
            applyRiskFilter(boolQuery);
        }

        boolQuery.must(QueryBuilders.rangeQuery(EXPECTED_VALUE.value())
                .gte(0L)
                .lte(100_000_000_000L));

        searchSourceBuilder.query(boolQuery);
        return searchRequest;
    }

    private SearchRequest getMonitoringKPI() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK.value()).field(ProcedureProperty.EXPECTED_VALUE.value()));
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        boolQuery.mustNot(QueryBuilders.termQuery(ProcedureProperty.MONITORING_STATUS_KEYWORD.value(), "None"));
        boolQuery.must(QueryBuilders.rangeQuery(EXPECTED_VALUE.value())
                .gte(0L)
                .lte(100_000_000_000L));
        searchSourceBuilder.query(boolQuery);
        return searchRequest;
    }

    private void setRiskedKpiInfo(KpiInfo kpiInfo) {
        SearchRequest searchRequest = getKPI(true);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setRiskProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setRiskProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue());
    }

    private void setMonitoringKpiInfo(KpiInfo kpiInfo) {
        SearchRequest searchRequest = getMonitoringKPI();
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setMonitoringCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setMonitoringValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue());
    }

    private void setTotalKpiInfo(KpiInfo kpiInfo) {
        SearchRequest searchRequest = getKPI(false);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue());
    }

    private void setTotalKpiInfo(KpiInfo kpiInfo, FilterQuery filterQuery) {
        SearchRequest searchRequest = getKPI(filterQuery, false);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue());
    }

    private void setRiskedKpiInfo(KpiInfo kpiInfo, FilterQuery filterQuery) {
        SearchRequest searchRequest = getKPI(filterQuery, true);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setRiskProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setRiskProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK.value())).getValue());
    }


}
