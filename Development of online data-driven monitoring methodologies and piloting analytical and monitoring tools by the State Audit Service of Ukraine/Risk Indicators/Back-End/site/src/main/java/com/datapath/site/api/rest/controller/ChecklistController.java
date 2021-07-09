package com.datapath.site.api.rest.controller;

import com.datapath.site.api.version.ApiVersion;
import com.datapath.site.dto.ChecklistDTO;
import com.datapath.site.services.ChecklistWebService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("checklist")
@AllArgsConstructor
public class ChecklistController {

    private final ChecklistWebService service;

    @ApiVersion({0.1})
    @GetMapping("{tenderOuterId}")
    public ChecklistDTO get(@PathVariable String tenderOuterId) {
        return service.get(tenderOuterId);
    }

    @ApiVersion({0.1})
    @PostMapping("save")
    public void save(@RequestBody @Valid ChecklistDTO checklist) {
        service.save(checklist);
    }
}
