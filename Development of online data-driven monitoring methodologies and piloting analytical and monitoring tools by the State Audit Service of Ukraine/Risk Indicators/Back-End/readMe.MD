- Install Java 8, Postgresql at least version 12 and Apache Druid

Druid instalation described in [druid.md](https://github.com/EBRD-ProzorroA7-RiskIndicators-SASU/Ukraine-Development-of-online-data-driven-monitoring-methodologies-and-piloting-analytical-tools/blob/main/Development%20of%20online%20data-driven%20monitoring%20methodologies%20and%20piloting%20analytical%20and%20monitoring%20tools%20by%20the%20State%20Audit%20Service%20of%20Ukraine/Risk%20Indicators/Back-End/druid.md) dile inside project in root

- Clone project to local machine
- Build projct using maven
- Get jar file from target folder
- Add application.properties and configure accrdoing to services data (druid, postgres). To run peoject with  . Default configuration file exists inside coodrinator module
-  Run application using java -jar <appname>.jar 
