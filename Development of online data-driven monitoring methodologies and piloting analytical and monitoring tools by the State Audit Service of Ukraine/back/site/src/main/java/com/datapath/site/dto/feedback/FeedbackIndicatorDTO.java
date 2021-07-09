package com.datapath.site.dto.feedback;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackIndicatorDTO {

    private String id;
    private String comment;
    private Integer indicatorResponseId;
}
