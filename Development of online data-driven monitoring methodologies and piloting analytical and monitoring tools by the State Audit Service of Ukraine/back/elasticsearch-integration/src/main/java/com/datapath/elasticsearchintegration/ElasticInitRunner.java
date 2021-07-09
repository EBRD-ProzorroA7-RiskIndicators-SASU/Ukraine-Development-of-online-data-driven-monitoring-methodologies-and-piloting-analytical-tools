package com.datapath.elasticsearchintegration;

import com.datapath.elasticsearchintegration.services.TenderObjectsProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ElasticInitRunner implements CommandLineRunner {

    @Autowired
    private TenderObjectsProvider provider;

    @Override
    public void run(String... args) {
        provider.init();
    }
}
