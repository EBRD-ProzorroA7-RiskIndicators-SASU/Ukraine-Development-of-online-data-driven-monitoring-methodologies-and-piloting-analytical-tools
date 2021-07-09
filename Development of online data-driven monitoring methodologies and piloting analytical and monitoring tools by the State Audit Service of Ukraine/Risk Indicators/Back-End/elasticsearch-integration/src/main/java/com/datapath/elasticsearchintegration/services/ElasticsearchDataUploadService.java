package com.datapath.elasticsearchintegration.services;

import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.UpdateByQueryRequest;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class ElasticsearchDataUploadService {

    private final RestHighLevelClient client;
    private final ObjectMapper objectMapper;

    void uploadItems(List<TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfos) throws IOException {

        BulkRequest bulkRequest = new BulkRequest();
        tenderIndicatorsCommonInfos.forEach(item -> {
            try {
                byte[] json = objectMapper.writeValueAsBytes(item);
                bulkRequest.add(new IndexRequest("tenders_indicators")
                        .id(item.getTenderOuterId())
                        .source(json, XContentType.JSON));
            } catch (JsonProcessingException e) {
                log.error("Fail while preparing bulk request for upload to elastic", e);
            }
        });

        BulkResponse bulkItemResponses = client.bulk(bulkRequest, RequestOptions.DEFAULT);
        log.info(bulkItemResponses.toString());
        if (bulkItemResponses.hasFailures()) {
            log.info("Uploading has failures - {}", bulkItemResponses.hasFailures());
            log.error(bulkItemResponses.buildFailureMessage());
        }
    }

    void updateInQueueForAllItems() throws IOException {
        UpdateByQueryRequest updateRequest = new UpdateByQueryRequest("tenders_indicators");

        updateRequest
                .setQuery(new TermQueryBuilder("inQueue", true))
                .setAbortOnVersionConflict(false)
                .setScript(
                        new Script(
                                ScriptType.INLINE,
                                "painless",
                                "ctx._source.inQueue = false",
                                Collections.emptyMap()
                        )
                );

        BulkByScrollResponse response = client.updateByQuery(updateRequest, RequestOptions.DEFAULT);
        log.info(response.toString());
    }
}
