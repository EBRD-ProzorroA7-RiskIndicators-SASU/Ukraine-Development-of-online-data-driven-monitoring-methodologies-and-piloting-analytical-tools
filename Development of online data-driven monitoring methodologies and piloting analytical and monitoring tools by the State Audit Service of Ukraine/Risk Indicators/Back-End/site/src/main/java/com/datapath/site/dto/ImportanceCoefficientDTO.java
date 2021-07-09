package com.datapath.site.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;

@Data
public class ImportanceCoefficientDTO {

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private Double expectedValue;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private Double tenderScore;

    @JsonIgnore
    @AssertTrue(message = "Sum of importance coefficient must be 1")
    public boolean isCorrectCoefficient() {
        return tenderScore + expectedValue == 1;
    }
}
