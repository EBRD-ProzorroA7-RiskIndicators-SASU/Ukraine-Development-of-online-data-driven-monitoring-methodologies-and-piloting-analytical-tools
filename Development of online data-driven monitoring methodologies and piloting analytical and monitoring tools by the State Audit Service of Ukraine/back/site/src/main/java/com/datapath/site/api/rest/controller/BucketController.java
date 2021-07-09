package com.datapath.site.api.rest.controller;

import com.datapath.site.api.version.ApiVersion;
import com.datapath.site.dto.TenderIdsWrapper;
import com.datapath.site.dto.bucket.request.BucketAssignRequest;
import com.datapath.site.dto.bucket.response.BucketResponse;
import com.datapath.site.services.BucketWebService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/monitoring/bucket")
@AllArgsConstructor
public class BucketController {


    private final BucketWebService service;

    @ApiVersion({0.1})
    @PutMapping
    public void addToBucket(@RequestBody TenderIdsWrapper tenderIdsWrapper) {
        service.add(tenderIdsWrapper);
    }

    @ApiVersion({0.1})
    @GetMapping
    public BucketResponse get() {
        return service.get();
    }

    @ApiVersion({0.1})
    @DeleteMapping
    public void deleteFromBucket(@RequestBody TenderIdsWrapper tenderIdsWrapper) {
        service.delete(tenderIdsWrapper);
    }

    @ApiVersion({0.1})
    @PostMapping
    public void assign(@RequestBody @Valid BucketAssignRequest request) {
        service.assign(request);
    }
}
