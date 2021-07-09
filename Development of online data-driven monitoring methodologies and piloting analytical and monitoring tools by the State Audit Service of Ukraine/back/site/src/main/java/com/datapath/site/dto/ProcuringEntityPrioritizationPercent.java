package com.datapath.site.dto;

import lombok.Data;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;

@Data
public class ProcuringEntityPrioritizationPercent {

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double lowPercent;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double mediumPercent;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double highPercent;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double procuringEntityPercent;
}
