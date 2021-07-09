package com.datapath.site.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndicatorParameterDTO {

    @NotBlank
    private String id;
    private String code;

    @NotNull
    @DecimalMin("0.1")
    @DecimalMax("0.5")
    private Double value;
}
