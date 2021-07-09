package com.datapath.site.dto.bucket.response;

import lombok.Data;

import java.util.List;

@Data
public class BucketAvailableFiltersDTO {

    private List<Long> assignedTo;
    private List<Long> assignedBy;
    private List<String> monitoringStatus;
}
