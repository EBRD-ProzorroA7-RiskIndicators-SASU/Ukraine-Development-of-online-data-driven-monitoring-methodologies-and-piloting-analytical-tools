package com.datapath.site.dto.bucket.response;

import lombok.Data;

import java.util.List;

@Data
public class BucketResponse {
    private BucketAvailableFiltersDTO filters;
    private List<BucketItemDTO> buckets;
}
