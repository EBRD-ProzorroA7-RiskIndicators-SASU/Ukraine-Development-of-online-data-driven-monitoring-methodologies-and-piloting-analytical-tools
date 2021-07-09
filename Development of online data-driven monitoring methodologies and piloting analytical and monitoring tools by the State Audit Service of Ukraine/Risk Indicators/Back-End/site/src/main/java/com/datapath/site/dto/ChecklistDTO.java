package com.datapath.site.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ChecklistDTO {

    private Long id;

    @NotBlank
    private String tenderOuterId;

    @NotBlank
    private String tenderId;

    private String reason;

    private String procedureLogType;

    @Valid
    @NotNull
    private List<ChecklistIndicatorDTO> indicators;
}
