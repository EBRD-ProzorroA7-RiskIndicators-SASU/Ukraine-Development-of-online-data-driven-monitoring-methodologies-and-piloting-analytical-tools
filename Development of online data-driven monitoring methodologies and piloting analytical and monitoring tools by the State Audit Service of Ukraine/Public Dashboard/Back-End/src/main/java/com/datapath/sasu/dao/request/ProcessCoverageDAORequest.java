package com.datapath.sasu.dao.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProcessCoverageDAORequest {

    private LocalDate startDate;
    private LocalDate endDate;
    private List<Integer> regions;

}
