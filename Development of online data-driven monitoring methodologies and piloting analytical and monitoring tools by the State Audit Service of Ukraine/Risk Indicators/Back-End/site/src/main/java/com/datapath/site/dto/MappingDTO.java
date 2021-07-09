package com.datapath.site.dto;

import lombok.Data;

import java.util.List;

@Data
public class MappingDTO {

    private List<IndicatorDTO> indicators;
    private List<ProcedureLogTypeDTO> procedureLogTypes;
    private List<IndicatorResponseDTO> indicatorResponses;
}
