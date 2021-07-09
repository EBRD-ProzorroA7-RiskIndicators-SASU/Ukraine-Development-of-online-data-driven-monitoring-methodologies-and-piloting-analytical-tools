package com.datapath.site.services;

import com.datapath.elasticsearchintegration.util.Mapping;
import com.datapath.persistence.entities.IndicatorEvaluations;
import com.datapath.persistence.repositories.IndicatorEvaluationsRepository;
import com.datapath.persistence.repositories.IndicatorRepository;
import com.datapath.persistence.repositories.feedback.FeedbackIndicatorResponseRepository;
import com.datapath.site.dto.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.springframework.util.CollectionUtils.isEmpty;

@Service
@AllArgsConstructor
public class MappingWebService {

    private final IndicatorRepository indicatorRepository;
    private final IndicatorEvaluationsRepository indicatorEvaluationsRepository;
    private final FeedbackIndicatorResponseRepository feedbackIndicatorResponseRepository;

    public MappingDTO get() {
        MappingDTO mapping = new MappingDTO();
        mapping.setIndicators(putIndicatorInfo());
        mapping.setProcedureLogTypes(putProcedureLogTypes());
        mapping.setIndicatorResponses(putIndicatorResponses());
        return mapping;
    }

    private List<IndicatorResponseDTO> putIndicatorResponses() {
        return feedbackIndicatorResponseRepository.findAll()
                .stream()
                .map(e -> new IndicatorResponseDTO(e.getId(), e.getValue()))
                .collect(toList());
    }

    private List<ProcedureLogTypeDTO> putProcedureLogTypes() {
        return Mapping.PROCEDURE_LOG_TYPE_CHECKLIST_SOLUTIONS.entrySet()
                .stream()
                .map(entry -> {
                    ProcedureLogTypeDTO dto = new ProcedureLogTypeDTO();
                    dto.setId(entry.getKey());
                    dto.setDescription(Mapping.PROCEDURE_LOG_TYPES.get(entry.getKey()).getValue().toString());
                    dto.setChecklistSolutions(new ProcedureLogTypeChecklistSolutionsDTO(entry.getValue()[0], entry.getValue()[1]));
                    return dto;
                })
                .collect(toList());
    }

    private List<IndicatorDTO> putIndicatorInfo() {
        return indicatorRepository.findAllByActiveTrueOrderById()
                .stream()
                .map(i -> {
                    IndicatorDTO dto = new IndicatorDTO();
                    dto.setId(i.getId());
                    dto.setAlgorithmDescription(i.getAlgorithmDescription());
                    dto.setBaseQuestion(i.getBaseQuestion());
                    dto.setShortName(i.getShortName());

                    List<IndicatorEvaluations> allByIndicator = indicatorEvaluationsRepository.findAllByIndicator(i.getId());
                    dto.setEvaluations(
                            isEmpty(allByIndicator) ?
                                    Collections.emptyList() :
                                    allByIndicator
                                            .stream()
                                            .map(IndicatorEvaluations::getEvaluation)
                                            .collect(toList())
                    );
                    return dto;
                })
                .collect(toList());
    }
}
