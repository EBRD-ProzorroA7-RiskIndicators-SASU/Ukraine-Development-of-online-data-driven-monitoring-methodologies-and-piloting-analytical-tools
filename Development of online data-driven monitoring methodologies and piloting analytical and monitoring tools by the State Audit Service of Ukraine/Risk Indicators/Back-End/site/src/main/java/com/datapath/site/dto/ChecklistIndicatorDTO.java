package com.datapath.site.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ChecklistIndicatorDTO {

    private Long id;

    @NotBlank
    private String indicator;

    @NotNull
    private Boolean answer;

    @NotBlank
    private String evaluation;
}
