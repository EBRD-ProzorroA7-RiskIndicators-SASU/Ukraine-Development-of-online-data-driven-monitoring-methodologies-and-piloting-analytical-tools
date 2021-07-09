package com.datapath.site.util;

import com.datapath.elasticsearchintegration.domain.FilterQuery;
import com.datapath.elasticsearchintegration.domain.FilteringDTO;
import com.datapath.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.site.dto.ProcedureLogTypeChecklistSolutionsDTO;

import javax.validation.constraints.NotNull;
import java.time.ZoneId;
import java.util.*;

import static com.datapath.elasticsearchintegration.util.Mapping.CUSTOM_BELOW_THRESHOLD_MODIFY_DATE;
import static com.datapath.elasticsearchintegration.util.Mapping.CUSTOM_BELOW_THRESHOLD_TYPE;

public class MappingsUtils {

    private static final List<String> OTHERS_ENTITY_KIND = Arrays.asList("defence", "defense", "other");

    private static final String OTHERS_ENTITY_KIND_TYPE = "other";
    private static final String OTHERS_ENTITY_KIND_TYPE_MAPPING = "Інші";

    private static final Map<String, ProcedureLogTypeChecklistSolutionsDTO> PROCEDURE_LOG_TYPE_CHECKLIST_SOLUTIONS_DTO_MAP =
            new HashMap<String, ProcedureLogTypeChecklistSolutionsDTO>() {{
       put("priorityAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(true, true));
       put("priorityNotAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(false, true));
       put("notPriorityAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(true, true));
       put("notPriorityNotAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(false, true));
       put("historyPriorityAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(true, false));
       put("historyPriorityNotAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(false, false));
       put("historyNotPriorityAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(true, false));
       put("historyNotPriorityNotAnalyzed", new ProcedureLogTypeChecklistSolutionsDTO(false, false));
       put("historyPriorityAnalyzedMonitoring", new ProcedureLogTypeChecklistSolutionsDTO(true, false));
       put("historyPriorityNotAnalyzedMonitoring", new ProcedureLogTypeChecklistSolutionsDTO(false, false));
       put("historyNotPriorityAnalyzedMonitoring", new ProcedureLogTypeChecklistSolutionsDTO(true, false));
    }};

    public static ProcedureLogTypeChecklistSolutionsDTO getByKey(String key) {
        return PROCEDURE_LOG_TYPE_CHECKLIST_SOLUTIONS_DTO_MAP.get(key);
    }

    //we use new value for 'belowThreshold' procedure type after 2020-04-18
    public static void updateProcedureTypeByDate(FilteringDTO filteringDTO, @NotNull Date endDate) {
        if (CUSTOM_BELOW_THRESHOLD_MODIFY_DATE.isBefore(endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate())) {
            List<KeyValueObject> updatedProcedureTypeFilter = new ArrayList<>();
            for (KeyValueObject keyValueObject : filteringDTO.getAvailableFilters().getProcedureTypes()) {
                if (((KeyValueObject) keyValueObject.getKey()).getKey().equals("belowThreshold")) {
                    KeyValueObject procedureTypeMapping = new KeyValueObject("belowThreshold", CUSTOM_BELOW_THRESHOLD_TYPE);
                    KeyValueObject newProcedureType = new KeyValueObject(procedureTypeMapping, keyValueObject.getValue());
                    updatedProcedureTypeFilter.add(newProcedureType);
                } else {
                    updatedProcedureTypeFilter.add(keyValueObject);
                }
            }
            filteringDTO.getAvailableFilters().setProcedureTypes(updatedProcedureTypeFilter, false);
        }
    }

    public static void updateProcuringEntityKind(FilteringDTO filteringDTO) {
        List<KeyValueObject> updatedProcuringEntityKind = new ArrayList<>();

        boolean isOtherPresent = false;
        long sumOfOthers = 0;

        for (KeyValueObject keyValue : filteringDTO.getAvailableFilters().getProcuringEntityKind()) {
            if (OTHERS_ENTITY_KIND.contains(((KeyValueObject) keyValue.getKey()).getKey())) {
                isOtherPresent = true;
                sumOfOthers += (long) keyValue.getValue();
            } else {
                updatedProcuringEntityKind.add(keyValue);
            }
        }

        if (isOtherPresent) {
            KeyValueObject otherKey = new KeyValueObject(OTHERS_ENTITY_KIND_TYPE, OTHERS_ENTITY_KIND_TYPE_MAPPING);
            KeyValueObject othersType = new KeyValueObject(otherKey, sumOfOthers);
            updatedProcuringEntityKind.add(othersType);
        }

        filteringDTO.getAvailableFilters().setProcuringEntityKind(updatedProcuringEntityKind, false);
    }

    public static void updateProcuringEntityKind(FilterQuery filterQuery) {
        if (OTHERS_ENTITY_KIND_TYPE.equals(filterQuery.getProcuringEntityKind())) {
            filterQuery.setProcuringEntityKind(String.join(",", OTHERS_ENTITY_KIND));
        }
    }
}
