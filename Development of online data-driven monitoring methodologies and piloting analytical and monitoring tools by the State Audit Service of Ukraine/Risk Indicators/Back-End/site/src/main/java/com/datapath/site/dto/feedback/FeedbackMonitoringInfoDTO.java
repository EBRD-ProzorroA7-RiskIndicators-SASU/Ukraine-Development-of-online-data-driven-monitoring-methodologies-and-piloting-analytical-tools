package com.datapath.site.dto.feedback;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackMonitoringInfoDTO {

    private Long id;
    private String number;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String stopNumber;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate stopDate;
}
