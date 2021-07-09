package com.datapath.site.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcedureLogTypeChecklistSolutionsDTO {

    private Boolean hasChecklist;
    private Boolean availableForChecklist;
}
