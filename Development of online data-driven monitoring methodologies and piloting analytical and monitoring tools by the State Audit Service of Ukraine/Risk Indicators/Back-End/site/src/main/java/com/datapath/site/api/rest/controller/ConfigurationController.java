package com.datapath.site.api.rest.controller;

import com.datapath.site.api.version.ApiVersion;
import com.datapath.site.dto.ConfigurationDTO;
import com.datapath.site.services.ConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
public class ConfigurationController {

    @Autowired
    private ConfigurationService service;

    @ApiVersion({0.1})
    @GetMapping("/configuration")
    public ConfigurationDTO get() {
        return service.get();
    }

    @ApiVersion({0.1})
    @PostMapping("/configuration")
    public ConfigurationDTO update(@RequestBody @Valid ConfigurationDTO configuration) {
        service.update(configuration);
        return service.get();
    }
}
