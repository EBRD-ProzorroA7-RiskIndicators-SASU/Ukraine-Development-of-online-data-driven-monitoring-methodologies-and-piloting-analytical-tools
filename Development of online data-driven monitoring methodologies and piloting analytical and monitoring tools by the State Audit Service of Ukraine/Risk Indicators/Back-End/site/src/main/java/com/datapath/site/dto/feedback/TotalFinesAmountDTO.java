package com.datapath.site.dto.feedback;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalFinesAmountDTO {

    private Integer count;
    private Double amount;
    private Double paidAmount;
}
