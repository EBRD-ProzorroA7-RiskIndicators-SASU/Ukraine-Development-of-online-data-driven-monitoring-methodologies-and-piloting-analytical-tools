package com.datapath.site.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.List;

@Data
public class ConfigurationDTO {

    @Valid
    private List<IndicatorParameterDTO> indicators;

    @Valid
    private ImportanceCoefficientDTO importanceCoefficient;

    @Min(value = 0)
    @Max(value = 366)
    private Long tendersCompletedDays;

    @Valid
    private ProcuringEntityPrioritizationPercent prioritizationPercent;

    @Valid
    private BucketRiskGroupParameters bucketRiskGroupParameters;
}
