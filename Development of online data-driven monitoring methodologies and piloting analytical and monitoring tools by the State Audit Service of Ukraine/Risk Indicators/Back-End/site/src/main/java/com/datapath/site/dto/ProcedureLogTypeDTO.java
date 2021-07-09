package com.datapath.site.dto;

import lombok.Data;

@Data
public class ProcedureLogTypeDTO {

    private String id;
    private String description;

    private ProcedureLogTypeChecklistSolutionsDTO checklistSolutions;
}
