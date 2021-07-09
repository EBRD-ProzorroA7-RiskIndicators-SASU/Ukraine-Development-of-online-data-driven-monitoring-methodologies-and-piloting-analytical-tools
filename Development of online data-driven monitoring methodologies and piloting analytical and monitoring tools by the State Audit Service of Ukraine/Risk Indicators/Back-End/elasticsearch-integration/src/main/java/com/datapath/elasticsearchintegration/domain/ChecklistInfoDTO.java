package com.datapath.elasticsearchintegration.domain;

import lombok.Data;

@Data
public class ChecklistInfoDTO {

    private String tenderOuterId;
    private Boolean hasChecklist;
    private Boolean availableForChecklist;
}
