package com.datapath.elasticsearchintegration.services;

import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class TenderDataUpdater extends BaseDataExtractor {

    private final RestHighLevelClient client;

    public TenderDataUpdater(RestHighLevelClient client) {
        this.client = client;
    }

    public void updateProcedureLogType(String tenderOuterId, String procedureLogType) {
        try {
            UpdateRequest updateRequest = getUpdateDocRequestBuilder(tenderOuterId);

            updateRequest.script(
                    new Script(
                            ScriptType.INLINE,
                            "painless",
                            "ctx._source.procedureLogType = " + procedureLogType,
                            Collections.emptyMap()
                    )
            ).retryOnConflict(1);

            UpdateResponse response = getUpdateResponse(updateRequest, client);
            log.info(response.getResult().toString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Can't update 'procedureLogType' in elastic document with tenderOuterId: " + tenderOuterId);
        }
    }

    public void updateFeedbackStatuses(String tenderOuterId, String feedbackStatuses) {
        try {
            UpdateRequest updateRequest = getUpdateDocRequestBuilder(tenderOuterId);

            updateRequest.script(
                    new Script(
                            ScriptType.INLINE,
                            "painless",
                            "ctx._source.feedbackStatuses = [" + feedbackStatuses + "]",
                            Collections.emptyMap()
                    )
            ).retryOnConflict(1);

            UpdateResponse response = getUpdateResponse(updateRequest, client);
            log.info(response.getResult().toString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Can't update 'feedbackStatuses' in elastic document with tenderOuterId: " + tenderOuterId);
        }
    }
}
