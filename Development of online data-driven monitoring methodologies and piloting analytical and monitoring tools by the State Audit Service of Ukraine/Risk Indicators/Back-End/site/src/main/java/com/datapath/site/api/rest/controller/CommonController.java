package com.datapath.site.api.rest.controller;

import com.datapath.site.api.rest.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CommonController {

    @RequestMapping("/**")
    public void disableAllRequests() {
        throw new ResourceNotFoundException();
    }
}
