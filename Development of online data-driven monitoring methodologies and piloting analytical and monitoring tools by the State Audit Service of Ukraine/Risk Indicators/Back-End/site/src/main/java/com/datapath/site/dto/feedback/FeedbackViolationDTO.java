package com.datapath.site.dto.feedback;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackViolationDTO {

    private Long id;
    private Double amount;
    private Double canceledAmount;
    private Double terminatedAmount;
    private Double returnedAmount;
}
