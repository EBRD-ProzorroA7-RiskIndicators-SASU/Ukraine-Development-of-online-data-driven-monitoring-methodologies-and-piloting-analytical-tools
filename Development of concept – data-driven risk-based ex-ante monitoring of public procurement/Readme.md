# Legal Transition Programme

## Ukraine: Development of online data-driven monitoring methodologies and piloting analytical and monitoring tools by the State Audit Service of Ukraine </br> </br> _Development of concept – data-driven risk-based ex-ante monitoring of public procurement_

### Description:
The feasibility of a data-driven, evidence-based, and risk-based approach to public procurement control is demonstrated and prototyped methodologies and digital tools, including a set of risk-indicators for [Open Contracting Data Standard (OCDS)](https://standard.open-contracting.org/latest/en/) structured data are produced in order to create the conceptual design of the digitised monitoring process and surrounding IT infrastructure, to identify main challenges and manage key stakeholders on their way to accept the new practice.

### Project timeline:

Nov 2018 – April 2019

### Project status:
In use by the SASU since 2019

## Context and problem statement
In April 2016, the [Public Procurement Law (Law)](https://zakon.rada.gov.ua/laws/show/922-19) came into force in Ukraine. Together with the new Law, the public procurement monitoring procedure was introduced. [The State Audit Service of Ukraine](http://www.dkrs.gov.ua/kru/en/) was assigned as the governmental authority responsible for performing public procurement monitoring.

According to the adopted amendments to the Law, the SASU may start the procurement procedure monitoring based on the triggered automated red flags and risk indicators defined by the monitoring methodology. In this regard, the Government of Ukraine requested [EBRD](https://www.ebrd.com/home) to assist in developing and piloting respective methodology and automated data-driven red flags as well as risk indicators tools for electronic public tenders’ official monitoring by SASU.

To fulfil the Law requirements, the development efforts were organised in two projects. Under the first project, the electronic Auditor’s Cabinet had to be developed and attached to the [Prozorro](https://prozorro.gov.ua) – an open-source [OCDS](https://standard.open-contracting.org/latest/en/) open data electronic public procurement system of Ukraine. The SOE “Prozorro” team took ownership of this project. 

The second project focused on the development of the automated tool, which can provide online analysis of the Prozorro public procurement Open Data and reference it against developed red flags and risk indicators automated algorithms. The results of the analysis had to be visible in the Auditor’s Cabinet to enable state auditors to decide on monitoring initiation according to the Law.

## Objectives and vision
Working with the EBRD GPA Technical Cooperation Facility, the SASU and [the Ministry for Development of Economy, Trade and Agriculture (MDETA)](https://www.me.gov.ua/?lang=en-GB) aimed to develop the pilot product for automated red flags and risk indicator monitoring tool in order to **translate the “red flag and risk indicators style” risk-based methodology into automated tools for the official monitoring**. The development of the tool served to **prove the concept** that it is possible for the **modern risk management process to be implemented in the Ukrainian procurement monitoring ecosystem** and that the **procurement process risks can be identified by applying automated red flags and risk indicators** to the procurement e-data and then addressed by authorised state bodies.

The EBRD-developed vision to achieve these objectives contained two primary workstreams:
-	Development of a **concept with the initial set of risk indicators** and a **concept of procurement procedures risk-based prioritisation** for ex-ante monitoring of the electronic public procurement procedures by SASU, in accordance with the latest amendments to the Public Procurement Law of Ukraine;
-	Development of **prototypes of indicators engine** and **risk-based procurement procedures prioritisation engine** for monitoring public procurement by SASU.

## Technological solution and implementation
To deliver this project, the [EBRD](https://www.ebrd.com/home) team performed the detailed analysis of the main factors and stakeholders influencing the monitoring process, analysed available risk management frameworks that could be applied, reviewed relevant documentation, as well as conducted series of interviews and working meetings with the process key stakeholders. The investigation resulted in an established **methodology approach** and a clear **definition of requirements** for online monitoring risk indicators, risky procedures queuing and prioritisation.

The project team described monitoring system architecture and data flow for the following electronic tool elements:
-	Prozorro integration module;
-	Relational database;
-	Analytic tables module;
-	Indicators coded algorithm library; 
-	Indicators integration and calculation module (risks calculation engine); 
-	Queue module; 
-	Queue API.

Following the theoretical exploration, the developed methodology was embedded into the prototypes of electronic tools, which were successfully piloted by [SASU](http://www.dkrs.gov.ua/kru/en/) with support of the EBRD. These e-tools included:
1.	**Risk engine application** which can perform red flags and risk indicators online automated calculation. </br> The calculation is based on the referencing the public procurement procedures Open Data from the [Prozorro](https://prozorro.gov.ua) system against designed red flags and risk indicators algorithms and stored in the library. Once the algorithm conditions are met, the application marks the procurement procedure with a respective red flag/risk indicators “positive” sign. This application checks the algorithms condition periodically and updates the results. The risk engine application also allows built-in managing parameters attached to the automated indicator, such as “likelihood” and “impact”.
2.	**Queuing and prioritisation engine.** </br> This application which collects public procurement procedures with positive red flags and risk indicators (risky procedures) referenced by Risk Engine. The application prioritises procedures in the queue by using an algorithm of ranking procedures with risks based on the number of red flags and risk indicators, positive calculation results and procurement procedure value. This engine allows the of building procedures with risks prioritised queues for each region of Ukraine.
3.	**Application Programming Interfaces (APIs).** </br> The APIs are created for querying information from Prozorro system and allow the querying of calculation results by Auditors Cabinet.

All prototypes were transferred to the Prozorro system administrator for management, maintenance and further development in line with the dedicated official methodology evolution.

## Results and future expectations
The proof of the concept **provided a vision of ex-ante monitoring on comprehensive scale** in line with the Law provisions, **demonstrated the feasibility** of the risk-based and data-driven approach to monitoring of public procurements in the Prozorro environment and **verified that designed methodologies and developed tools had practical potential**.

The Prozorro **successfully launched the innovative pieces of technologies – Indicators engine** for automated calculation of data-based risk indicators and **Prioritisation engine** for automated selections of procedures with a high-risk score for monitoring by the SASU – that can yield significant benefits to the Prozorro ecosystem and its controls environment by combining risk management concept, Open Data opportunities and up to the minute data analytics technologies.

Finally, the SASU took the designed methodologies as a basis for the official decree on public procurement monitoring, **which was approved in October 2018**. Ukrainian state auditors developed their basic capacity to deliver the newly introduced responsibilities, and **for the year 2019, they covered by monitoring 6% in quantity and 20% in value of above threshold public procurement transactions**.

## Lessons learnt

