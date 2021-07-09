package com.datapath.elasticsearchintegration.services;

import com.datapath.elasticsearchintegration.constants.ProcedureProperty;
import com.datapath.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.elasticsearchintegration.util.Mapping;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class MonitoringBucketService extends BaseDataExtractor {

    private final RestHighLevelClient client;

    public List<TenderIndicatorsCommonInfo> get(List<String> tenderIds) {
        SearchRequest searchRequest = getRequestBuilder();
        searchRequest.source().size(10000)
                .query(QueryBuilders.termsQuery(ProcedureProperty.TENDER_ID_KEYWORD.value(), tenderIds));
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        List<TenderIndicatorsCommonInfo> results = responseToEntities(searchResponse);

        for (TenderIndicatorsCommonInfo procedure : results) {
            procedure.setTenderStatus(Mapping.TENDER_STATUS.get(procedure.getTenderStatus()).getValue().toString());
            procedure.setProcedureType(Mapping.extractProcedureType(procedure.getProcedureType(), procedure.getDatePublished()));
            procedure.setProcuringEntityKind(Mapping.PROCURING_ENTITY_KIND.get(procedure.getProcuringEntityKind()).getValue().toString());
            procedure.setGsw(Mapping.extractGswValue(procedure.getGsw()));
            procedure.setMonitoringStatus(Mapping.MONITORING_STATUS.get(procedure.getMonitoringStatus()).getValue().toString());
            procedure.setMonitoringAppealAsString(Mapping.APPEAL.get(Boolean.valueOf(procedure.isMonitoringAppeal()).toString()).getValue().toString());
            procedure.setIndicatorsWithRiskMapped(new ArrayList<>());
            for (String risk : procedure.getIndicatorsWithRisk()) {
                procedure.getIndicatorsWithRiskMapped().add(new KeyValueObject(risk, Mapping.RISK_INDICATORS.get(risk)));
            }
        }

        return results;
    }

}
