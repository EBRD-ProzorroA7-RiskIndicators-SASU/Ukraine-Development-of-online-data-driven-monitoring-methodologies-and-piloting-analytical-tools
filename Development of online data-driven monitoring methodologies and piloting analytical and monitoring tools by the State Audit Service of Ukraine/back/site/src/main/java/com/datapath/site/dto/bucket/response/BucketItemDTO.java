package com.datapath.site.dto.bucket.response;

import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BucketItemDTO {

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private Long assignedBy;
    private Long assignedTo;
    private TenderIndicatorsCommonInfo tender;
}
