package com.datapath.site.services;

import com.datapath.elasticsearchintegration.services.ElasticsearchDataExtractorService;
import com.datapath.elasticsearchintegration.util.Mapping;
import com.datapath.persistence.entities.Tender;
import com.datapath.persistence.entities.feedback.*;
import com.datapath.persistence.repositories.TenderRepository;
import com.datapath.persistence.repositories.feedback.*;
import com.datapath.site.dto.feedback.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.*;
import static org.springframework.util.CollectionUtils.isEmpty;

@Service
@AllArgsConstructor
@Slf4j
public class FeedbackWebService {

    private final ElasticsearchDataExtractorService elasticService;
    private final FeedbackMonitoringInfoRepository monitoringInfoRepository;
    private final FeedbackResultRepository resultRepository;
    private final FeedbackSummaryRepository summaryRepository;
    private final FeedbackViolationRepository violationRepository;
    private final FeedbackIndicatorRepository indicatorRepository;
    private final FeedbackIndicatorResponseRepository indicatorResponseRepository;
    private final TenderRepository tenderRepository;

    @Transactional
    public FeedbackDTO get(String tenderOuterId) {
        FeedbackDTO response = new FeedbackDTO();

        response.setTenderOuterId(tenderOuterId);
        response.setMonitoringInfo(putFeedbackMonitoringInfo(tenderOuterId));
        response.setResult(putFeedbackResult(tenderOuterId));
        response.setSummary(putFeedbackSummary(tenderOuterId));
        response.setViolation(putFeedbackViolation(tenderOuterId));
        response.setIndicators(putIndicators(tenderOuterId));

        return response;
    }

    @Transactional
    public void save(FeedbackDTO request) {
        List<String> feedbackGroupStatuses = new ArrayList<>();

        Tender tender = tenderRepository.findFirstByOuterId(request.getTenderOuterId());
        if (isNull(tender)) throw new RuntimeException("Tender not present. OuterId " + request.getTenderOuterId());

        if (isNotEmptyObject(request.getMonitoringInfo())) {
            FeedbackMonitoringInfo entity = new FeedbackMonitoringInfo();
            BeanUtils.copyProperties(request.getMonitoringInfo(), entity);
            entity.setTenderOuterId(request.getTenderOuterId());
            entity.setTenderId(request.getTenderId());
            feedbackGroupStatuses.add(Mapping.FEEDBACK_STATUS.get("hasMonitoringInfo").getKey().toString());
            monitoringInfoRepository.save(entity);
        } else {
            if (nonNull(request.getMonitoringInfo().getId())) {
                monitoringInfoRepository.deleteById(request.getMonitoringInfo().getId());
            }
        }

        if (isNotEmptyObject(request.getSummary())) {
            FeedbackSummary entity = new FeedbackSummary();
            BeanUtils.copyProperties(request.getSummary(), entity);
            entity.setTenderOuterId(request.getTenderOuterId());
            entity.setTenderId(request.getTenderId());
            feedbackGroupStatuses.add(Mapping.FEEDBACK_STATUS.get("hasSummary").getKey().toString());
            summaryRepository.save(entity);
        } else {
            if (nonNull(request.getSummary().getId())) {
                summaryRepository.deleteById(request.getSummary().getId());
            }
        }

        if (isNotEmptyObject(request.getViolation())) {
            FeedbackViolation entity = new FeedbackViolation();
            BeanUtils.copyProperties(request.getViolation(), entity);
            entity.setTenderOuterId(request.getTenderOuterId());
            entity.setTenderId(request.getTenderId());
            feedbackGroupStatuses.add(Mapping.FEEDBACK_STATUS.get("hasViolation").getKey().toString());
            violationRepository.save(entity);
        } else {
            if (nonNull(request.getViolation().getId())) {
                violationRepository.deleteById(request.getViolation().getId());
            }
        }

        if (!isEmpty(request.getIndicators())) {

            Map<Integer, FeedbackIndicatorResponse> indicatorResponseMap = indicatorResponseRepository.findAll()
                    .stream()
                    .collect(toMap(FeedbackIndicatorResponse::getId, Function.identity()));

            List<FeedbackIndicator> indicatorEntities = new ArrayList<>();
            for (FeedbackIndicatorDTO indicator : request.getIndicators()) {
                if (isNotEmptyObject(indicator)) {
                    FeedbackIndicator entity = new FeedbackIndicator();
                    entity.setId(indicator.getId());
                    entity.setComment(indicator.getComment());
                    entity.setTenderId(request.getTenderId());
                    entity.setTenderOuterId(request.getTenderOuterId());

                    if (nonNull(indicator.getIndicatorResponseId())) {
                        entity.setIndicatorResponse(indicatorResponseMap.getOrDefault(indicator.getIndicatorResponseId(), null));
                    }

                    indicatorEntities.add(entity);
                }
            }

            indicatorRepository.deleteAllByTenderOuterId(request.getTenderOuterId());
            if (!isEmpty(indicatorEntities)) {
                feedbackGroupStatuses.add(Mapping.FEEDBACK_STATUS.get("hasIndicators").getKey().toString());
                indicatorRepository.saveAll(indicatorEntities);
            }
        }

        FeedbackResult feedbackResultEntity = null;

        if (isNotEmptyObject(request.getResult())) {
            FeedbackResultDTO result = request.getResult();
            feedbackResultEntity = new FeedbackResult();
            feedbackResultEntity.setId(result.getId());
            feedbackResultEntity.setDate(result.getDate());
            feedbackResultEntity.setNumber(result.getNumber());
            feedbackResultEntity.setTenderOuterId(request.getTenderOuterId());
            feedbackResultEntity.setTenderId(request.getTenderId());
        }

        List<FeedbackMaterial> materials = request.getResult().getMaterials()
                .stream()
                .filter(this::isNotEmptyObject)
                .map(m -> {
                    FeedbackMaterial materialEntity = new FeedbackMaterial();
                    materialEntity.setId(m.getId());
                    materialEntity.setName(m.getName());
                    materialEntity.setNumber(m.getNumber());
                    materialEntity.setDate(m.getDate());
                    return materialEntity;
                }).collect(toList());

        List<FeedbackProtocol> protocols = request.getResult().getProtocols()
                .stream()
                .filter(this::isNotEmptyObject)
                .map(p -> {
                    FeedbackProtocol protocolEntity = new FeedbackProtocol();
                    protocolEntity.setId(p.getId());
                    protocolEntity.setNumber(p.getNumber());
                    protocolEntity.setDate(p.getDate());
                    protocolEntity.setDocument(p.getDocument());
                    protocolEntity.setDescription(p.getDescription());
                    protocolEntity.setAmount(p.getAmount());
                    protocolEntity.setPaidAmount(p.getPaidAmount());
                    return protocolEntity;
                }).collect(toList());

        if (!isEmpty(materials) || !isEmpty(protocols)) {
            if (isNull(feedbackResultEntity)) {
                feedbackResultEntity = new FeedbackResult();
                feedbackResultEntity.setTenderOuterId(request.getTenderOuterId());
                feedbackResultEntity.setTenderId(request.getTenderId());
                if (nonNull(request.getResult().getId()))
                    feedbackResultEntity.setId(request.getResult().getId());
            }

            for (FeedbackMaterial material : materials) {
                material.setResult(feedbackResultEntity);
            }
            feedbackResultEntity.setMaterials(materials);
            for (FeedbackProtocol p : protocols) {
                p.setResult(feedbackResultEntity);
            }
            feedbackResultEntity.setProtocols(protocols);
        }

        if (isNull(feedbackResultEntity)) {
            if (nonNull(request.getResult().getId())) {
                resultRepository.deleteById(request.getResult().getId());
            }
        } else {
            feedbackGroupStatuses.add(Mapping.FEEDBACK_STATUS.get("hasResult").getKey().toString());
            resultRepository.save(feedbackResultEntity);
        }


        String feedbackStatuses = feedbackGroupStatuses.stream()
                .map(s -> "\"" + s + "\"")
                .collect(joining(","));
        elasticService.updateFeedbackStatuses(request.getTenderOuterId(), feedbackStatuses);
    }

    private List<FeedbackIndicatorDTO> putIndicators(String tenderOuterId) {
        List<FeedbackIndicator> indicators = indicatorRepository.findAllByTenderOuterId(tenderOuterId);

        if (isEmpty(indicators)) return null;

        return indicators.stream()
                .map(i -> new FeedbackIndicatorDTO(i.getId(), i.getComment(), i.getIndicatorResponse().getId()))
                .collect(toList());
    }

    private FeedbackMonitoringInfoDTO putFeedbackMonitoringInfo(String tenderOuterId) {
        FeedbackMonitoringInfo entity = monitoringInfoRepository.findByTenderOuterId(tenderOuterId);

        if (isNull(entity)) return null;

        return FeedbackMonitoringInfoDTO.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .number(entity.getNumber())
                .stopDate(entity.getStopDate())
                .stopNumber(entity.getStopNumber())
                .build();
    }

    private FeedbackResultDTO putFeedbackResult(String tenderOuterId) {
        FeedbackResult entity = resultRepository.findByTenderOuterId(tenderOuterId);

        if (isNull(entity)) return null;

        return FeedbackResultDTO.builder()
                .id(entity.getId())
                .number(entity.getNumber())
                .date(entity.getDate())
                .materials(putMaterials(entity.getMaterials()))
                .protocols(putProtocols(entity.getProtocols()))
                .totalFinesAmount(putTotalFinesAmount(entity.getProtocols()))
                .build();
    }

    private TotalFinesAmountDTO putTotalFinesAmount(List<FeedbackProtocol> protocols) {
        TotalFinesAmountDTO result = new TotalFinesAmountDTO();

        result.setCount(protocols.size());
        result.setAmount(
                protocols.stream()
                        .filter(p -> nonNull(p.getAmount()))
                        .mapToDouble(FeedbackProtocol::getAmount)
                        .sum()
        );
        result.setPaidAmount(
                protocols.stream()
                        .filter(p -> nonNull(p.getPaidAmount()))
                        .mapToDouble(FeedbackProtocol::getPaidAmount)
                        .sum()
        );

        return result;
    }

    private List<FeedbackProtocolDTO> putProtocols(List<FeedbackProtocol> protocols) {
        return protocols.stream()
                .map(p -> FeedbackProtocolDTO.builder()
                        .id(p.getId())
                        .number(p.getNumber())
                        .date(p.getDate())
                        .amount(p.getAmount())
                        .description(p.getDescription())
                        .document(p.getDocument())
                        .paidAmount(p.getPaidAmount())
                        .build()
                ).collect(toList());
    }

    private List<FeedbackMaterialDTO> putMaterials(List<FeedbackMaterial> materials) {
        return materials.stream()
                .map(m -> FeedbackMaterialDTO.builder()
                        .id(m.getId())
                        .number(m.getNumber())
                        .date(m.getDate())
                        .name(m.getName())
                        .build()
                ).collect(toList());
    }

    private FeedbackSummaryDTO putFeedbackSummary(String tenderOuterId) {
        FeedbackSummary entity = summaryRepository.findByTenderOuterId(tenderOuterId);

        if (isNull(entity)) return null;

        return FeedbackSummaryDTO.builder()
                .id(entity.getId())
                .number(entity.getNumber())
                .date(entity.getDate())
                .build();
    }

    private FeedbackViolationDTO putFeedbackViolation(String tenderOuterId) {
        FeedbackViolation entity = violationRepository.findByTenderOuterId(tenderOuterId);

        if (isNull(entity)) return null;

        return FeedbackViolationDTO.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .canceledAmount(entity.getCanceledAmount())
                .returnedAmount(entity.getReturnedAmount())
                .terminatedAmount(entity.getTerminatedAmount())
                .build();
    }

    private boolean isNotEmptyObject(Object o) {
        if (isNull(o)) return false;

        try {
            Field[] fields = o.getClass().getDeclaredFields();
            for (Field f : fields) {
                f.setAccessible(true);

                if ("id".equals(f.getName())) continue;

                Object value = f.get(o);
                if (value instanceof List) continue;

                if (nonNull(value)) return true;
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
        return false;
    }
}
