package com.datapath.druidintegration.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
@Data
@EqualsAndHashCode(callSuper = false)
public class DruidTenderIndicator extends DruidIndicator {
    private String date;
    private String time;
    private String tenderOuterId;
    private String tenderId;
    private String status;
    private String procedureType;
    private String indicatorId;
    private String indicatorType;
    private Integer indicatorValue;
    private Long iterationId;
    private Double indicatorImpact;
    private List<String> lotIds;

}
