package com.datapath.site.dto.bucket.request;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class BucketAssignRequest {

    @NotNull
    private List<String> tenderIds;

    @NotNull
    private Long userId;
}
