package com.datapath.site.dto;

import lombok.Data;

import java.util.List;

@Data
public class IndicatorDTO {

    private String id;
    private String shortName;
    private String baseQuestion;
    private String algorithmDescription;

    private List<String> evaluations;
}
