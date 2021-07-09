package com.datapath.site.services;

import com.datapath.persistence.domain.ConfigurationDomain;
import com.datapath.persistence.entities.Configuration;
import com.datapath.persistence.entities.ConfigurationHistory;
import com.datapath.persistence.entities.Indicator;
import com.datapath.persistence.entities.IndicatorImpactHistory;
import com.datapath.persistence.entities.queue.IndicatorsQueueConfiguration;
import com.datapath.persistence.entities.queue.IndicatorsQueueConfigurationHistory;
import com.datapath.persistence.repositories.ConfigurationHistoryRepository;
import com.datapath.persistence.repositories.IndicatorImpactHistoryRepository;
import com.datapath.persistence.repositories.IndicatorRepository;
import com.datapath.persistence.repositories.queue.IndicatorsQueueConfigurationHistoryRepository;
import com.datapath.persistence.repositories.queue.IndicatorsQueueConfigurationRepository;
import com.datapath.persistence.service.ConfigurationDaoService;
import com.datapath.persistence.utils.ConfigurationUtils;
import com.datapath.site.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static org.springframework.util.CollectionUtils.isEmpty;

@Service
public class ConfigurationService {

    @Autowired
    private IndicatorRepository indicatorRepository;
    @Autowired
    private IndicatorImpactHistoryRepository indicatorImpactHistoryRepository;
    @Autowired
    private ConfigurationDaoService configurationService;
    @Autowired
    private ConfigurationHistoryRepository configurationHistoryRepository;
    @Autowired
    private IndicatorsQueueConfigurationRepository queueConfigurationRepository;
    @Autowired
    private IndicatorsQueueConfigurationHistoryRepository indicatorsQueueConfigurationHistoryRepository;

    public ConfigurationDTO get() {
        ConfigurationDTO response = new ConfigurationDTO();

        response.setIndicators(putIndicatorParameters());

        ConfigurationDomain configuration = configurationService.getConfiguration();

        response.setImportanceCoefficient(putImportanceCoefficient(configuration));
        response.setTendersCompletedDays(putTendersCompletedDays(configuration));
        response.setPrioritizationPercent(putPrioritizationPercent());
        response.setBucketRiskGroupParameters(putBucketRiskGroupParameters(configuration));

        return response;
    }

    private BucketRiskGroupParameters putBucketRiskGroupParameters(ConfigurationDomain configuration) {
        BucketRiskGroupParameters parameters = new BucketRiskGroupParameters();
        parameters.setMediumLeftBoundary(configuration.getBucketRiskGroupMediumLeft());
        parameters.setMediumRightBoundary(configuration.getBucketRiskGroupMediumRight());
        return parameters;
    }

    private ProcuringEntityPrioritizationPercent putPrioritizationPercent() {
        IndicatorsQueueConfiguration configuration = queueConfigurationRepository.findOneById(ConfigurationUtils.CONFIGURATION_ID);

        ProcuringEntityPrioritizationPercent prioritizationPercent = new ProcuringEntityPrioritizationPercent();

        prioritizationPercent.setLowPercent(configuration.getLowTopRiskPercentage());
        prioritizationPercent.setMediumPercent(configuration.getMediumTopRiskPercentage());
        prioritizationPercent.setHighPercent(configuration.getHighTopRiskPercentage());

        prioritizationPercent.setProcuringEntityPercent(configuration.getMediumTopRiskProcuringEntityPercentage());

        return prioritizationPercent;
    }

    private Long putTendersCompletedDays(ConfigurationDomain configuration) {
        return configuration.getTendersCompletedDays();
    }

    private List<IndicatorParameterDTO> putIndicatorParameters() {
        return indicatorRepository.findAllByActiveTrueOrderById().stream()
                .map(i -> new IndicatorParameterDTO(i.getId(), i.getCode(), i.getImpact()))
                .collect(Collectors.toList());
    }

    private ImportanceCoefficientDTO putImportanceCoefficient(ConfigurationDomain configuration) {
        ImportanceCoefficientDTO coefficient = new ImportanceCoefficientDTO();
        coefficient.setTenderScore(configuration.getTenderScoreCoefficient());
        coefficient.setExpectedValue(configuration.getExpectedValueCoefficient());
        return coefficient;
    }

    @Transactional
    public void update(ConfigurationDTO configuration) {
        updateIndicators(configuration.getIndicators());
        updateImportanceCoefficients(configuration.getImportanceCoefficient());
        updateConfig(configuration.getTendersCompletedDays(), ConfigurationUtils.TENDERS_COMPLETED_DAYS_KEY);
        updatePrioritizationPercent(configuration.getPrioritizationPercent());
        updateBucketRiskGroupParameters(configuration.getBucketRiskGroupParameters());
    }

    private void updateBucketRiskGroupParameters(BucketRiskGroupParameters bucketRiskGroupParameters) {
        if (nonNull(bucketRiskGroupParameters)) {
            updateConfig(bucketRiskGroupParameters.getMediumLeftBoundary(), ConfigurationUtils.BUCKET_RISK_GROUP_MEDIUM_LEFT_KEY);
            updateConfig(bucketRiskGroupParameters.getMediumRightBoundary(), ConfigurationUtils.BUCKET_RISK_GROUP_MEDIUM_RIGHT_KEY);
        }
    }

    private void updatePrioritizationPercent(ProcuringEntityPrioritizationPercent prioritizationPercent) {
        if (nonNull(prioritizationPercent)) {
            IndicatorsQueueConfiguration configuration = queueConfigurationRepository.findOneById(ConfigurationUtils.CONFIGURATION_ID);

            List<IndicatorsQueueConfigurationHistory> histories = new LinkedList<>();

            if (nonNull(prioritizationPercent.getLowPercent())) {
                IndicatorsQueueConfigurationHistory history = new IndicatorsQueueConfigurationHistory();
                history.setFieldName(ConfigurationUtils.LOW_TOP_RISK_PERCENTAGE);
                history.setPreviousValue(configuration.getLowTopRiskPercentage());
                history.setValue(prioritizationPercent.getLowPercent());
                histories.add(history);

                configuration.setLowTopRiskPercentage(prioritizationPercent.getLowPercent());
            }
            if (nonNull(prioritizationPercent.getMediumPercent())) {
                IndicatorsQueueConfigurationHistory history = new IndicatorsQueueConfigurationHistory();
                history.setFieldName(ConfigurationUtils.MEDIUM_TOP_RISK_PERCENTAGE);
                history.setPreviousValue(configuration.getMediumTopRiskPercentage());
                history.setValue(prioritizationPercent.getMediumPercent());
                histories.add(history);

                configuration.setMediumTopRiskPercentage(prioritizationPercent.getMediumPercent());
            }
            if (nonNull(prioritizationPercent.getHighPercent())) {
                IndicatorsQueueConfigurationHistory history = new IndicatorsQueueConfigurationHistory();
                history.setFieldName(ConfigurationUtils.HIGH_TOP_RISK_PERCENTAGE);
                history.setPreviousValue(configuration.getHighTopRiskPercentage());
                history.setValue(prioritizationPercent.getHighPercent());
                histories.add(history);

                configuration.setHighTopRiskPercentage(prioritizationPercent.getHighPercent());
            }
            if (nonNull(prioritizationPercent.getProcuringEntityPercent())) {
                IndicatorsQueueConfigurationHistory history = new IndicatorsQueueConfigurationHistory();
                history.setFieldName(ConfigurationUtils.PROCURING_ENTITY_PERCENTAGES);
                history.setPreviousValue(configuration.getMediumTopRiskProcuringEntityPercentage());
                history.setValue(prioritizationPercent.getProcuringEntityPercent());
                histories.add(history);

                configuration.setLowTopRiskProcuringEntityPercentage(prioritizationPercent.getProcuringEntityPercent());
                configuration.setMediumTopRiskProcuringEntityPercentage(prioritizationPercent.getProcuringEntityPercent());
                configuration.setHighTopRiskProcuringEntityPercentage(prioritizationPercent.getProcuringEntityPercent());
            }

            queueConfigurationRepository.save(configuration);

            histories.forEach(indicatorsQueueConfigurationHistoryRepository::save);
        }
    }

    private void updateImportanceCoefficients(ImportanceCoefficientDTO importanceCoefficient) {
        if (nonNull(importanceCoefficient)) {
            updateConfig(importanceCoefficient.getTenderScore(), ConfigurationUtils.TENDER_SCORE_COEFFICIENT_KEY);
            updateConfig(importanceCoefficient.getExpectedValue(), ConfigurationUtils.EXPECTED_VALUE_COEFFICIENT_KEY);
        }
    }

    private <T> void updateConfig(T value, String key) {
        if (nonNull(value)) {
            Configuration config = configurationService.findByKey(key);

            ConfigurationHistory configHistory = new ConfigurationHistory();
            configHistory.setKey(config.getKey());
            configHistory.setPreviousValue(config.getValue());
            configHistory.setValue(value.toString());

            config.setValue(value.toString());

            configurationService.save(config);
            configurationHistoryRepository.save(configHistory);
        }
    }

    private void updateIndicators(List<IndicatorParameterDTO> indicators) {
        if (!isEmpty(indicators)) {
            indicators.forEach(i -> {
                Indicator indicator = indicatorRepository.findById(i.getId())
                        .orElseThrow(() -> new RuntimeException(String.format("Indicator with id %s not found", i.getId())));

                IndicatorImpactHistory indicatorHistory = new IndicatorImpactHistory();
                indicatorHistory.setIndicatorId(indicator.getId());
                indicatorHistory.setPreviousValue(indicator.getImpact());
                indicatorHistory.setValue(i.getValue());

                indicator.setImpact(i.getValue());

                indicatorRepository.save(indicator);
                indicatorImpactHistoryRepository.save(indicatorHistory);
            });
        }
    }
}
