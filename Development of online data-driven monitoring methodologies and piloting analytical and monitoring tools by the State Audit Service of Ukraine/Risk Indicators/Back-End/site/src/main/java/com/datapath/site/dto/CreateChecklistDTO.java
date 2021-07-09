package com.datapath.site.dto;

import lombok.Data;

import java.util.Set;

@Data
public class CreateChecklistDTO {

    private String tenderOuterId;
    private String tenderId;

    private Set<String> indicators;
}
