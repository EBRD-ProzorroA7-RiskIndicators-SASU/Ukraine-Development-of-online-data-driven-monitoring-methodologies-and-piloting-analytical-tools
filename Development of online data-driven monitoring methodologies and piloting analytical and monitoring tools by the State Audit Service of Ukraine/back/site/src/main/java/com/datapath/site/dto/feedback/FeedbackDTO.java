package com.datapath.site.dto.feedback;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@NoArgsConstructor
public class FeedbackDTO {

    @NotBlank
    private String tenderOuterId;
    @NotBlank
    private String tenderId;

    private FeedbackMonitoringInfoDTO monitoringInfo;
    private FeedbackResultDTO result;
    private FeedbackSummaryDTO summary;
    private FeedbackViolationDTO violation;
    private List<FeedbackIndicatorDTO> indicators;
}
