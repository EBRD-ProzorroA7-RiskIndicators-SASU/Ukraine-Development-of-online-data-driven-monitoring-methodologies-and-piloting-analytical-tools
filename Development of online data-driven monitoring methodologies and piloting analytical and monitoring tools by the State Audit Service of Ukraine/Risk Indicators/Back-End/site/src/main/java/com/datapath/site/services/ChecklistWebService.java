package com.datapath.site.services;

import com.datapath.elasticsearchintegration.domain.ChecklistInfoDTO;
import com.datapath.elasticsearchintegration.domain.ProceduresWrapper;
import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.elasticsearchintegration.services.ElasticsearchDataExtractorService;
import com.datapath.persistence.entities.Checklist;
import com.datapath.persistence.entities.ChecklistIndicator;
import com.datapath.persistence.service.ChecklistDaoService;
import com.datapath.site.dto.ChecklistDTO;
import com.datapath.site.dto.ChecklistIndicatorDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@Slf4j
@Service
@AllArgsConstructor
public class ChecklistWebService {

    private final ChecklistDaoService checklistDaoService;
    private final ElasticsearchDataExtractorService elasticService;

    public ChecklistDTO get(String tenderOuterId) {
        Checklist checklistEntity = checklistDaoService.findByTenderOuterId(tenderOuterId);

        if (isNull(checklistEntity)) {
            throw new RuntimeException(String.format("Checklist for tender %s not found", tenderOuterId));
        }

        ChecklistDTO checklist = new ChecklistDTO();
        checklist.setId(checklistEntity.getId());
        checklist.setTenderOuterId(checklistEntity.getTenderOuterId());
        checklist.setTenderId(checklistEntity.getTenderId());
        checklist.setReason(checklistEntity.getReason());

        checklist.setIndicators(
                checklistEntity.getIndicators()
                        .stream()
                        .map(i -> {
                            ChecklistIndicatorDTO indicatorDTO = new ChecklistIndicatorDTO();
                            indicatorDTO.setId(i.getId());
                            indicatorDTO.setIndicator(i.getIndicator());
                            indicatorDTO.setEvaluation(i.getEvaluation());
                            indicatorDTO.setAnswer(i.getAnswer());
                            return indicatorDTO;
                        }).collect(Collectors.toList())
        );
        return checklist;
    }

    public void putChecklistInfo(ProceduresWrapper data) {
        List<ChecklistInfoDTO> checklistInfos = new LinkedList<>();

        Set<String> existedProcedureChecklist = checklistDaoService.findByTenderOuterIds(
                data.getProcedures().stream()
                        .map(TenderIndicatorsCommonInfo::getTenderOuterId)
                        .collect(Collectors.toList())
        ).stream()
                .map(Checklist::getTenderOuterId).collect(Collectors.toSet());

        data.getProcedures()
                .forEach(procedure -> {
                    ChecklistInfoDTO procedureChecklistInfo = new ChecklistInfoDTO();
                    procedureChecklistInfo.setTenderOuterId(procedure.getTenderOuterId());
                    procedureChecklistInfo.setAvailableForChecklist(procedure.isInQueue());
                    procedureChecklistInfo.setHasChecklist(existedProcedureChecklist.contains(procedure.getTenderOuterId()));
                    checklistInfos.add(procedureChecklistInfo);
                });
        data.setChecklistInfo(checklistInfos);
    }

    @Transactional
    public void save(ChecklistDTO checklistDTO) {
        try {
            Checklist newChecklist = new Checklist();
            newChecklist.setId(checklistDTO.getId());
            newChecklist.setTenderOuterId(checklistDTO.getTenderOuterId());
            newChecklist.setTenderId(checklistDTO.getTenderId());
            newChecklist.setReason(checklistDTO.getReason());
            newChecklist.setIndicators(
                    checklistDTO.getIndicators()
                            .stream()
                            .map(i -> {
                                ChecklistIndicator checklistIndicator = new ChecklistIndicator();
                                checklistIndicator.setId(i.getId());
                                checklistIndicator.setIndicator(i.getIndicator());
                                checklistIndicator.setAnswer(i.getAnswer());
                                checklistIndicator.setEvaluation(i.getEvaluation());
                                return checklistIndicator;
                            })
                            .collect(Collectors.toList())
            );

            newChecklist.getIndicators().forEach(i -> i.setChecklist(newChecklist));

            checklistDaoService.save(newChecklist);

            elasticService.updateProcedureLogType(
                    checklistDTO.getTenderOuterId(),
                    updateProcedureLogType(checklistDTO.getProcedureLogType())
            );
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    private String updateProcedureLogType(String procedureLogType) {
        return "\"" + procedureLogType.replace("NotAnalyzed", "Analyzed") + "\"";
    }
}
