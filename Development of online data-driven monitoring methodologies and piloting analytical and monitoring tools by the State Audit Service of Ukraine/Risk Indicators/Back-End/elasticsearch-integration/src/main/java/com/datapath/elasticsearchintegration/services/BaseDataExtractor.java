package com.datapath.elasticsearchintegration.services;

import com.datapath.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.support.WriteRequest;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.datapath.elasticsearchintegration.constants.Constants.ELASTICSEARCH_INDEX;
import static com.datapath.elasticsearchintegration.constants.ProcedureProperty.DATE_PUBLISHED;
import static com.datapath.elasticsearchintegration.constants.ProcedureProperty.TENDER_RISK_SCORE;

@Slf4j
public abstract class BaseDataExtractor {

    void applyDateRange(String startOfPeriod, String endOfPeriod, BoolQueryBuilder boolQuery) {
        boolQuery.must(QueryBuilders.rangeQuery(DATE_PUBLISHED.value()).gte(startOfPeriod).lte(endOfPeriod));
    }

    void applyRiskFilter(BoolQueryBuilder boolQuery) {
        boolQuery.must(QueryBuilders.rangeQuery(TENDER_RISK_SCORE.value()).gt(0));
    }

    SearchRequest getRequestBuilder() {
        SearchRequest searchRequest = new SearchRequest(ELASTICSEARCH_INDEX);
        SearchSourceBuilder source = new SearchSourceBuilder();
        source.trackTotalHits(true);
        searchRequest.source(source);
        return searchRequest;
    }

    UpdateRequest getUpdateDocRequestBuilder(String id) {
        UpdateRequest updateRequest = new UpdateRequest(ELASTICSEARCH_INDEX, id);
        updateRequest.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
        return updateRequest;
    }

    UpdateResponse getUpdateResponse(UpdateRequest request, RestHighLevelClient client) {
        try {
            return client.update(request, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    SearchResponse getSearchResponse(SearchRequest searchRequest, RestHighLevelClient client) {
        try {
            return client.search(searchRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    KeyValueObject bucketToKeyValueObject(Terms.Bucket bucket) {
        return new KeyValueObject(bucket.getKeyAsString(), bucket.getDocCount());
    }

    List<TenderIndicatorsCommonInfo> responseToEntities(SearchResponse searchResponse) {
        List<TenderIndicatorsCommonInfo> results = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        for (SearchHit hit : searchResponse.getHits()) {
            TenderIndicatorsCommonInfo tenderIndicatorsCommonInfo = null;
            try {
                tenderIndicatorsCommonInfo = objectMapper.readValue(hit.getSourceAsString(), TenderIndicatorsCommonInfo.class);
            } catch (IOException e) {
                log.error("Could not map elastic response object to POJO", e);
            }
            results.add(tenderIndicatorsCommonInfo);
        }
        return results;
    }
}
