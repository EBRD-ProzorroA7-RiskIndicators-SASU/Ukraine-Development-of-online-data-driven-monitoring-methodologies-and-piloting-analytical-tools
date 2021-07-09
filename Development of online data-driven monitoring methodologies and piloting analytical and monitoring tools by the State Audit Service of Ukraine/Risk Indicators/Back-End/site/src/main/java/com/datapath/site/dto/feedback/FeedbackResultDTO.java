package com.datapath.site.dto.feedback;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResultDTO {

    private Long id;
    private String number;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    private TotalFinesAmountDTO totalFinesAmount;

    private List<FeedbackMaterialDTO> materials;
    private List<FeedbackProtocolDTO> protocols;
}
