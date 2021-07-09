package com.datapath.site.api.rest.controller;

import com.datapath.site.api.version.ApiVersion;
import com.datapath.site.dto.feedback.FeedbackDTO;
import com.datapath.site.services.FeedbackWebService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("feedback")
@AllArgsConstructor
public class FeedbackController {

    private final FeedbackWebService service;

    @ApiVersion({0.1})
    @GetMapping("{tenderOuterId}")
    public FeedbackDTO get(@PathVariable String tenderOuterId) {
        return service.get(tenderOuterId);
    }

    @ApiVersion({0.1})
    @PostMapping("save")
    public FeedbackDTO save(@RequestBody @Valid FeedbackDTO request) {
        service.save(request);
        return service.get(request.getTenderOuterId());
    }
}
