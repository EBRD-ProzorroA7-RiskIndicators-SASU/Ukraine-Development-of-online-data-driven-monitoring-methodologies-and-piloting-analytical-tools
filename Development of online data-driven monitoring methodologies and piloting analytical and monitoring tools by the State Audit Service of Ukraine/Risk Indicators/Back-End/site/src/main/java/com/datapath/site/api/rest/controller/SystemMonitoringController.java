package com.datapath.site.api.rest.controller;

import com.datapath.elasticsearchintegration.services.ElasticsearchDataExtractorService;
import com.datapath.site.dto.SystemMonitoringDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class SystemMonitoringController {

    private final ElasticsearchDataExtractorService elasticService;

    @GetMapping("system-monitoring")
    public SystemMonitoringDTO getSystemMonitoring() {
        return new SystemMonitoringDTO(elasticService.getLastTenderDate());
    }
}
