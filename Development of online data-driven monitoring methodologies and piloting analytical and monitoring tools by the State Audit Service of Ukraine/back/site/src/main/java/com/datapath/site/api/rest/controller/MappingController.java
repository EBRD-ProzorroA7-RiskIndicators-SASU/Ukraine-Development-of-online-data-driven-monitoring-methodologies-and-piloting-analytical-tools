package com.datapath.site.api.rest.controller;

import com.datapath.site.api.version.ApiVersion;
import com.datapath.site.dto.MappingDTO;
import com.datapath.site.services.MappingWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mappings")
@CrossOrigin(origins = "*")
public class MappingController {

    @Autowired
    private MappingWebService service;

    @ApiVersion({0.1})
    @GetMapping
    public MappingDTO get() {
        return service.get();
    }
}
