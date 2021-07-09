package com.datapath.elasticsearchintegration.domain;

import com.datapath.elasticsearchintegration.util.Mapping;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.datapath.elasticsearchintegration.constants.RiskedProcedure.*;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;

@Data
public class AvailableFilters {

    private final static List<String> PROCESSED_TYPES = asList(
            "negotiation",
            "reporting",
            "aboveThresholdUA",
            "belowThreshold",
            "aboveThresholdEU",
            "covid19",
            "competitiveDialogueUA",
            "competitiveDialogueUA.stage2",
            "closeFrameworkAgreementSelectionUA",
            "closeFrameworkAgreementUA",
            "negotiation.quick",
            "competitiveDialogueEU",
            "competitiveDialogueEU.stage2",
            "simple.defense",
            "aboveThresholdUA.defense",
            "esco"
    );

    private List<KeyValueObject> riskedIndicators = new ArrayList<>();
    private List<KeyValueObject> riskedProcedures;
    private List<KeyValueObject> tenderRank = new ArrayList<>();
    private List<KeyValueObject> regions = new ArrayList<>();
    private List<KeyValueObject> cpv2Names = new ArrayList<>();
    private List<KeyValueObject> cpvNames = new ArrayList<>();
    private List<KeyValueObject> procedureTypes = new ArrayList<>();
    private List<KeyValueObject> currency = new ArrayList<>();
    private List<KeyValueObject> procuringEntities = new ArrayList<>();
    private List<KeyValueObject> tenderStatuses = new ArrayList<>();
    private List<KeyValueObject> procuringEntityKind = new ArrayList<>();
    private List<KeyValueObject> gsw = new ArrayList<>();
    private List<KeyValueObject> monitoringStatus = new ArrayList<>();
    private List<KeyValueObject> monitoringOffices = new ArrayList<>();
    private List<KeyValueObject> complaints = new ArrayList<>();
    private List<KeyValueObject> monitoringCause = new ArrayList<>();
    private List<KeyValueObject> monitoringAppeal = new ArrayList<>();
    private List<KeyValueObject> queuePriority = new ArrayList<>();
    private List<KeyValueObject> feedbackStatuses = new ArrayList<>();

    public void setRiskedProcedures(List<KeyValueObject> riskedProcedures) {
        this.riskedProcedures = riskedProcedures.stream()
                .peek(item -> item.setKey(Mapping.RISKED_PROCEDURES.get((String) item.getKey())))
                .peek(item -> {

                    switch (((KeyValueObject) (item.getKey())).getKey().toString()) {
                        case "withRisk":
                            ((KeyValueObject) (item.getKey())).setKey(WITH_RISK);
                            break;
                        case "withoutRisk":
                            ((KeyValueObject) (item.getKey())).setKey(WITHOUT_RISK);
                            break;
                        case "withoutPriority":
                            ((KeyValueObject) (item.getKey())).setKey(WITH_RISK_NO_PRIORITY);
                            break;
                        case "withPriority":
                            ((KeyValueObject) (item.getKey())).setKey(WITH_RISK_HAS_PRIORITY);
                            break;
                        default:
                    }
                })
                .collect(toList());
    }

    public void setTenderScoreRank(List<KeyValueObject> scores) {
        this.tenderRank = scores;
    }

    public void setTenderStatuses(List<KeyValueObject> tenderStatuses) {
        this.tenderStatuses = tenderStatuses.stream()
                .peek(item -> item.setKey(Mapping.TENDER_STATUS.get((String) item.getKey())))
                .collect(toList());
    }

    public void setGsw(List<KeyValueObject> gsw) {
        this.gsw = gsw.stream()
                .peek(item -> item.setKey(Mapping.extractGsw((String) item.getKey())))
                .collect(Collectors.groupingBy(KeyValueObject::getKey, Collectors.summingLong(it -> ((Long) it.getValue()))))
                .entrySet()
                .stream()
                .map(item -> new KeyValueObject(item.getKey(), item.getValue()))
                .collect(toList());

    }

    public void setProcedureTypes(List<KeyValueObject> procedureTypes, boolean processMapping) {
        if (processMapping) {
            this.procedureTypes = procedureTypes.stream()
                    .filter(this::isProcessedType)
                    .peek(item -> {
                        KeyValueObject key;
                        if (item.getKey().equals("negotiation.quick")) {
                            key = Mapping.PROCEDURE_TYPES.get("negotiation");
                        } else {
                            key = Mapping.PROCEDURE_TYPES.get(item.getKey());
                        }
                        item.setKey(key);
                    })
                    .collect(Collectors.groupingBy(KeyValueObject::getKey, Collectors.summingLong(it -> ((Long) it.getValue()))))
                    .entrySet()
                    .stream()
                    .map(item -> new KeyValueObject(item.getKey(), item.getValue()))
                    .collect(toList());
        } else {
            this.procedureTypes = procedureTypes;
        }
    }

    private boolean isProcessedType(KeyValueObject item) {
        return PROCESSED_TYPES.contains(item.getKey());
    }

    public void setMonitoringStatus(List<KeyValueObject> monitoringStatus) {
        this.monitoringStatus = monitoringStatus.stream()
                .peek(item -> item.setKey(Mapping.MONITORING_STATUS.get((String) item.getKey())))
                .collect(toList());
    }

    public void setProcuringEntityKind(List<KeyValueObject> procuringEntityKind, boolean processMapping) {
        if (processMapping) {
            this.procuringEntityKind = procuringEntityKind.stream()
                    .peek(item -> item.setKey(Mapping.PROCURING_ENTITY_KIND.get((String) item.getKey())))
                    .collect(toList());
        } else {
            this.procuringEntityKind = procuringEntityKind;
        }
    }

    public void setComplaints(List<KeyValueObject> complaints) {
        this.complaints = complaints.stream()
                .peek(item -> item.setKey(Mapping.COMPLAINTS.get((String) item.getKey())))
                .collect(toList());
    }

    public void setMonitoringAppeal(List<KeyValueObject> appeal) {
        this.monitoringAppeal = appeal.stream()
                .peek(item -> item.setKey(Mapping.APPEAL.get((String) item.getKey())))
                .collect(toList());
    }

    public void setMonitoringCause(List<KeyValueObject> monitoringCause) {
        this.monitoringCause = monitoringCause.stream()
                .peek(item -> item.setKey(Mapping.MONITORING_CAUSE.get((String) item.getKey())))
                .collect(toList());
    }

    public void setFeedbackStatuses(List<KeyValueObject> feedbackStatuses) {
        this.feedbackStatuses = feedbackStatuses.stream()
                .peek(item -> item.setKey(Mapping.FEEDBACK_STATUS.get((String) item.getKey())))
                .collect(toList());
    }
}
