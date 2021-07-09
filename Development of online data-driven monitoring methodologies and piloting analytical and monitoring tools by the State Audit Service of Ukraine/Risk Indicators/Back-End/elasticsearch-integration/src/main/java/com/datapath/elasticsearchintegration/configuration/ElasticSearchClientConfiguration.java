package com.datapath.elasticsearchintegration.configuration;

import com.datapath.elasticsearchintegration.constants.RiskedProcedure;
import com.datapath.elasticsearchintegration.constants.TenderScoreRank;
import com.datapath.elasticsearchintegration.converters.RiskedProcedureEnumConverter;
import com.datapath.elasticsearchintegration.converters.TenderScoreRankEnumConverter;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import javax.annotation.PreDestroy;
import java.io.IOException;

@Service
public class ElasticSearchClientConfiguration implements InitializingBean {

    @Value("${elastic.host}")
    private String host;

    @Value("${elastic.port}")
    private int port;

    private RestHighLevelClient client;

    @Bean
    public RestHighLevelClient restHighLevelClient() {
        return client;
    }

    @InitBinder
    public void initBinder(WebDataBinder dataBinder) {
        dataBinder.registerCustomEditor(RiskedProcedure.class, new RiskedProcedureEnumConverter());
        dataBinder.registerCustomEditor(TenderScoreRank.class, new TenderScoreRankEnumConverter());
    }

    @Override
    public void afterPropertiesSet() {
        client = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost(host, port, "http")
                ).setRequestConfigCallback(
                        callback -> callback.setConnectTimeout(120000).setSocketTimeout(120000)
                )
        );
    }

    @PreDestroy
    public void closeConnection() throws IOException {
        client.close();
    }
}
