package com.datapath.site.services;

import com.datapath.elasticsearchintegration.constants.TenderScoreRank;
import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.elasticsearchintegration.services.MonitoringBucketService;
import com.datapath.persistence.domain.ConfigurationDomain;
import com.datapath.persistence.entities.monitoring.BucketItem;
import com.datapath.persistence.entities.monitoring.User;
import com.datapath.persistence.repositories.monitoring.BucketRepository;
import com.datapath.persistence.service.ConfigurationDaoService;
import com.datapath.site.dto.TenderIdsWrapper;
import com.datapath.site.dto.bucket.request.BucketAssignRequest;
import com.datapath.site.dto.bucket.response.BucketAvailableFiltersDTO;
import com.datapath.site.dto.bucket.response.BucketItemDTO;
import com.datapath.site.dto.bucket.response.BucketResponse;
import com.datapath.site.exceptions.BucketOverfullException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

@Service
@AllArgsConstructor
public class BucketWebService {

    private final BucketRepository bucketRepository;
    private final MonitoringBucketService monitoringBucketService;
    private final UserService userService;
    private final ConfigurationDaoService configurationService;

    private static final int BUCKET_MAX_COUNT = 500;

    public BucketResponse get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        User user = userService.findDBUserByEmail(currentPrincipalName);

        List<BucketItem> bucketItems = bucketRepository.findAllByUserOrAssigned(user, user);
        Map<String, TenderIndicatorsCommonInfo> mappedTenders = getTenderData(bucketItems);

        List<BucketItemDTO> buckets = mapToDto(bucketItems, mappedTenders);

        BucketResponse response = new BucketResponse();
        response.setBuckets(buckets);
        response.setFilters(getAvailableFilters(buckets));
        return response;
    }

    @Transactional
    public void add(TenderIdsWrapper tenderIdsWrapper) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        User user = userService.findDBUserByEmail(currentPrincipalName);

        //TODO:needs check this logic
        if (isTooMuchForBucket(tenderIdsWrapper.getTenderIds().size(), user)) {
            throw new BucketOverfullException(BUCKET_MAX_COUNT);
        }

        List<BucketItem> bucketItems = tenderIdsWrapper.getTenderIds()
                .stream()
                .filter(t -> !bucketRepository.existsByTenderIdAndUser(t, user))
                .map(item -> {
                    BucketItem bucketItem = new BucketItem();
                    bucketItem.setTenderId(item);
                    bucketItem.setUser(user);
                    bucketItem.setAssigned(user);
                    return bucketItem;
                }).collect(toList());

        bucketRepository.saveAll(bucketItems);
    }

    @Transactional
    public void delete(TenderIdsWrapper tenderIdsWrapper) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        User user = userService.findDBUserByEmail(currentPrincipalName);
        bucketRepository.deleteAllByUserAndTenderIdIn(user, tenderIdsWrapper.getTenderIds());
    }

    @Transactional
    public void assign(BucketAssignRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        User user = userService.findDBUserByEmail(currentPrincipalName);
        User assignTo = userService.findDBUserById(request.getUserId());

        List<BucketItem> bucketItems = bucketRepository.findAllByUserAndTenderIdIn(user, request.getTenderIds());
        bucketItems.forEach(b -> b.setAssigned(assignTo));

        bucketRepository.saveAll(bucketItems);
    }

    private List<BucketItemDTO> mapToDto(List<BucketItem> bucketItems,
                                         Map<String, TenderIndicatorsCommonInfo> mappedTenders) {
        return bucketItems.stream()
                .map(b -> {
                    BucketItemDTO item = new BucketItemDTO();
                    item.setDate(b.getDate());
                    item.setTender(mappedTenders.get(b.getTenderId()));
                    item.setAssignedTo(b.getAssigned().getId());
                    item.setAssignedBy(b.getUser().getId());
                    return item;
                })
                .filter(b -> nonNull(b.getTender()))
                .collect(toList());

    }

    private BucketAvailableFiltersDTO getAvailableFilters(List<BucketItemDTO> bucketItems) {
        BucketAvailableFiltersDTO response = new BucketAvailableFiltersDTO();
        response.setAssignedTo(
                bucketItems.stream()
                        .map(BucketItemDTO::getAssignedTo)
                        .distinct()
                        .sorted()
                        .collect(toList())
        );
        response.setAssignedBy(
                bucketItems.stream()
                        .map(BucketItemDTO::getAssignedBy)
                        .distinct()
                        .sorted()
                        .collect(toList())
        );
        response.setMonitoringStatus(
                bucketItems.stream()
                        .map(BucketItemDTO::getTender)
                        .map(TenderIndicatorsCommonInfo::getMonitoringStatus)
                        .distinct()
                        .sorted()
                        .collect(toList())
        );
        return response;
    }

    private Map<String, TenderIndicatorsCommonInfo> getTenderData(List<BucketItem> bucketItems) {
        List<String> tenderIds = bucketItems.stream()
                .map(BucketItem::getTenderId)
                .distinct()
                .collect(toList());

        List<TenderIndicatorsCommonInfo> results = monitoringBucketService.get(tenderIds);

        calcScoreRank(results);

        return results.stream()
                .collect(toMap(TenderIndicatorsCommonInfo::getTenderId, Function.identity()));
    }

    private boolean isTooMuchForBucket(long newIdsCount, User user) {
        return bucketRepository.countByUser(user) + newIdsCount > BUCKET_MAX_COUNT;
    }

    private void calcScoreRank(List<TenderIndicatorsCommonInfo> results) {
        ConfigurationDomain configuration = configurationService.getConfiguration();

        results.forEach(r -> {
            if (r.tenderRiskScore == null) {
                return;
            }
            if (r.tenderRiskScore < configuration.getBucketRiskGroupMediumLeft()) {
                r.tenderRiskScoreRank = TenderScoreRank.LOW.value();
            } else if (r.tenderRiskScore > configuration.getBucketRiskGroupMediumRight()) {
                r.tenderRiskScoreRank = TenderScoreRank.HIGH.value();
            } else {
                r.tenderRiskScoreRank = TenderScoreRank.MEDIUM.value();
            }
        });
    }
}
