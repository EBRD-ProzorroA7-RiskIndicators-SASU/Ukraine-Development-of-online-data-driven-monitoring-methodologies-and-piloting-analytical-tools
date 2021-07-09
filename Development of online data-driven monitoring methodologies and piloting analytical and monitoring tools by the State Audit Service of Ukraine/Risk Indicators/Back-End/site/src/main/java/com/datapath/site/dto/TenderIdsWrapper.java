package com.datapath.site.dto;

import lombok.Data;

import java.util.List;

@Data
public class TenderIdsWrapper {

    private List<String> tenderIds;

    private List<String> columns;
}
