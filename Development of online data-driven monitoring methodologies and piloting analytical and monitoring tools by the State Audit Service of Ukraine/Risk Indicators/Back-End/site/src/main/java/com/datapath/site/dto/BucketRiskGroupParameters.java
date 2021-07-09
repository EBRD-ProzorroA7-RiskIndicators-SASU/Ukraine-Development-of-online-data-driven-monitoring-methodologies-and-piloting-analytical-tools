package com.datapath.site.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.validation.constraints.AssertTrue;

@Data
public class BucketRiskGroupParameters {

    private Double mediumLeftBoundary;
    private Double mediumRightBoundary;

    @JsonIgnore
    @AssertTrue(message = "Incorrect bucket boundary parameters (left boundary must be less than right boundary)")
    public boolean isCorrectBoundaryParameters() {
        return mediumLeftBoundary < mediumRightBoundary;
    }
}
