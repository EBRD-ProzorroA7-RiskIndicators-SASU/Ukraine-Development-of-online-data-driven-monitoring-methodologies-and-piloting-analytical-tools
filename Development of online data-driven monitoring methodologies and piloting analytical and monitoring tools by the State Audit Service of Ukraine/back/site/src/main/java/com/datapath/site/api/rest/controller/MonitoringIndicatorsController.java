package com.datapath.site.api.rest.controller;


import com.datapath.elasticsearchintegration.domain.FilterQuery;
import com.datapath.elasticsearchintegration.domain.FilteringDTO;
import com.datapath.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.elasticsearchintegration.services.ElasticsearchDataExtractorService;
import com.datapath.elasticsearchintegration.util.Mapping;
import com.datapath.site.api.version.ApiVersion;
import com.datapath.site.dto.TenderIdsWrapper;
import com.datapath.site.exceptions.ExportOverfullException;
import com.datapath.site.services.ChecklistWebService;
import com.datapath.site.services.export.ExportService;
import com.datapath.site.util.MappingsUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/monitoring")
@CrossOrigin(origins = "*")
public class MonitoringIndicatorsController {

    private ElasticsearchDataExtractorService elasticService;
    private ExportService exportService;
    private ChecklistWebService checklistWebService;

    private static final int EXPORT_MAX_QUANTITY = 60_000;

    @Autowired(required = false)
    public void setChecklistWebService(ChecklistWebService checklistWebService) {
        this.checklistWebService = checklistWebService;
    }

    @Autowired(required = false)
    public void setElasticService(ElasticsearchDataExtractorService elasticService) {
        this.elasticService = elasticService;
    }

    @Autowired(required = false)
    public void setExportService(ExportService exportService) {
        this.exportService = exportService;
    }

    @ApiVersion({0.1})
    @PostMapping("/filter/all")
    public FilteringDTO filterEverything(@RequestBody @Valid FilterQuery filterQuery, BindingResult result, HttpServletResponse response) throws IOException {

        if (result.hasErrors()) {
            response.sendError(400, "Bad date range");
            return null;
        }

        MappingsUtils.updateProcuringEntityKind(filterQuery);

        FilteringDTO filteringDTO = elasticService.applyFilter(filterQuery);
        filteringDTO.setKpiInfo(elasticService.getKpiInfo());
        filteringDTO.setKpiInfoFiltered(elasticService.getKpiInfoFiltered(filterQuery));
        filteringDTO.setChartsDataWraper(elasticService.getChartsDataWrapper(filterQuery));

        checklistWebService.putChecklistInfo(filteringDTO.getData());

        MappingsUtils.updateProcedureTypeByDate(filteringDTO, filterQuery.getEndDate());
        MappingsUtils.updateProcuringEntityKind(filteringDTO);

        return filteringDTO;
    }

    @ApiVersion({0.1})
    @PostMapping("/filter-data")
    public Object search(@RequestBody @Valid FilterQuery filterQuery, BindingResult result, HttpServletResponse response) throws IOException {
        if (result.hasErrors()) {
            response.sendError(400, "Bad date range");
            return Collections.emptyList();
        }
        return elasticService.getFilterData(filterQuery);
    }

    @ApiVersion({0.1})
    @PostMapping("/check-all")
    public Object checkAll(@RequestBody @Valid FilterQuery filterQuery, BindingResult result, HttpServletResponse response) throws IOException {
        if (result.hasErrors()) {
            response.sendError(400, "Bad date range");
            return Collections.emptyList();
        }
        filterQuery.setSize(50000);
        return elasticService.checkAll(filterQuery);
    }

    @ApiVersion({0.1})
    @PostMapping("/export")
    public ResponseEntity<Resource> exportToExcel(@RequestBody TenderIdsWrapper tenderIdsWrapper) {

        if (tenderIdsWrapper.getTenderIds().size() > EXPORT_MAX_QUANTITY) {
            throw new ExportOverfullException(EXPORT_MAX_QUANTITY);
        }
        Resource resource = new ByteArrayResource(exportService.export(tenderIdsWrapper.getTenderIds(), tenderIdsWrapper.getColumns()));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Ternders_Export.xlsx\"")
                .body(resource);
    }

    @ApiVersion({0.1})
    @GetMapping("/export/fields")
    public List<KeyValueObject> exportMapping() {
        return Mapping.EXPORT_FIELD_MAPPING;
    }

    @ApiVersion({0.1})
    @GetMapping("/mapping/risks")
    public List<KeyValueObject> risksMapping() {
        return Mapping.RISK_INDICATORS.entrySet().stream().map(entry -> new KeyValueObject(entry.getKey(), entry.getValue())).collect(Collectors.toList());
    }
}
