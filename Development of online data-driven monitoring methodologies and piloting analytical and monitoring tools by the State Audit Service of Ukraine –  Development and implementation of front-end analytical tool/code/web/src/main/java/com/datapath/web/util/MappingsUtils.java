package com.datapath.web.util;

import com.datapath.elasticsearchintegration.domain.FilterQuery;
import com.datapath.elasticsearchintegration.domain.FilteringDTO;
import com.datapath.elasticsearchintegration.domain.KeyValueObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MappingsUtils {
    private static final List<String> OTHERS_ENTITY_KIND = Arrays.asList("defence", "defense", "other");

    private static final String OTHERS_ENTITY_KIND_TYPE = "other";
    private static final String OTHERS_ENTITY_KIND_TYPE_MAPPING = "Інші";

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
