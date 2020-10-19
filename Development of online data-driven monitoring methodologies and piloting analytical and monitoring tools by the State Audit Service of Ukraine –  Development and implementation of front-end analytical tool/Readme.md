# Legal Transition Programme

## Development of online data-driven monitoring methodologies and piloting analytical and monitoring tools by the State Audit Service of Ukraine – Development and implementation of front-end analytical tool

### Description:

The [SASU](http://www.dkrs.gov.ua/kru/en/) auditors were supported in piloting the developed conceptual design of the data-driven and risk-based digital procurements monitoring approach; a tool that could automatically consolidate the procurement procedures risk data accumulated in real-time to enable auditors effectively and quickly select procedures for monitoring as well as to analyse sets of procurement procedures in various dimensionswas was developed.

### Project timeline:

Aug 2019 – Jan 2020

### Project status:
In use by the SASU since January 2020

## Context and problem statement
To analyse information signalling the presence of signs of violation in the field of public procurement, [the State Audit Service of Ukraine (SASU)](http://www.dkrs.gov.ua/kru/en/) needs to process a huge amount of data from various sources. In 2019, with the cooperation between the Government of Ukraine, Transparency International Ukraine and the [EBRD](https://www.ebrd.com/home), a set of automatic risk indicators was developed that indicate the likelihood of the existence of offences in procurement procedures. 

Under the TC project, the software, including 35 automated risk indicators, was successfully implemented and put into operation. This software automatically checks procurement procedures against developed risk indicators and forms an ordered list of procedures that have been recognised as risky. The ordered list of selected risky procedures then is shown in the electronic Auditor’s Cabinet, developed by SE “Prozorro” as an auditor’s dedicated tool for initiation and conducting monitoring process as well as official communication with the contracting entities within the monitoring procedure and publication of the monitoring conclusion.

However, the state auditors expressed interest in the functionality that was not covered by the developed solution. What they had in the Auditor’s Cabinet was that for all risky procedures in a queue marked as a priority, the system generated drafts for future monitoring automatically. To be able to understand for which procedure the draft was created and what indicators showed the positive calculation results for this procedure, the auditor had to go inside the draft. As a result, the auditor was forced to go manually throughout all drafts to select the required data, and this procedure could take a lot of time.

In addition, the Auditor’s Cabinet offered no filters, search engine or other useful functionality for querying as well as processing monitoring drafts. SASU had need of analytical infrastructure and additional technical capacity to analyse procurement procedures more efficiently and focus on those procurement procedures where the risk of violation is the most likely and/or that could potentially cause significant losses of public funds.

## Objectives and vision
Working with the [EBRD](https://www.ebrd.com/home) GPA Technical Cooperation Facility, the [SASU](http://www.dkrs.gov.ua/kru/en/) and [MDETA](https://www.me.gov.ua/?lang=en-GB) aimed to modernise existing public procurement monitoring infrastructure by introducing a modern user-friendly electronic analytical tool that could support auditors by automatically consolidating transactions data accumulated in real-time from various Open Data sources to enable them to:
-	analyse sets of procurement procedures in various dimensions, and 
-	effectively and quickly select procedures for monitoring. 

The EBRD-developed vision to achieve these objectives contained two primary workstreams:
-	Development and implementation of the front-end analytical tool for exploring and queuing ‘red-flags’ based transactional risk indicators with the methodology for procedures queue forming, KPI calculation and their visual interpretation;
-	Conducting an online training session for end-users – members of the SASU staff responsible for monitoring public procurement to enable them to implement eProcurement audit activities.

## Technological solution and implementation
The steps for development the front-end analytical tool are chronologically described below.
1. Discussing and agreeing on the functional and non-functional requirements. 
2. Defining of the basic modules of the analytical tool and prepared the necessary technical documentation by the project team . 
3. The required mock-ups of the future tool’s interface were designed and approved, including elements of control, forms for displaying the calculation results, sets of analytical dashboards and their location.
4. The module for selecting and consolidating the data from identified sources of information (a structured central database of the analytical tool, which enabled the consolidation of all the data needed to perform further analysis of procurement transactions) was developed.
5. As far as the analytical tool interface was displaying an array of procedures in a table format, the table metrics ware introduced, for instance, the number of transactions in the table, etc., to summarise the amount of data that the end-user is currently working with, thus the completed functionality for the visualisation of the transactions array was created.
6. The functionality of filters for a general and selected array of procurement procedures was developed and tested in order to enable auditors to consider the array of public procurement transactions in different dimensions. 
7. The analytical information was presented graphically to help auditors to localise risks in the public procurement system under different dimensions and more efficiently select transactions for monitoring.
8. The functionality of the basket was provided to allow auditors to store selected procurement transactions up to the official initiation of monitoring.
9. The transaction marking functionality was implemented to visually mark such procurement procedures, in the framework of which the special events occurred, which should be reported to the auditor. 
10. Final amendments were made, and all identified bugs were eliminated based on the results of the tests made by auditors.

As the result, the ready for deployment into a production environment of the Beneficiary front-end analytical tool was created.

## Results and future expectations
The implemented project proved that the online risk-based data-driven monitoring concept is viable for Ukrainian public procurement environment. The user-friendly tool automatically consolidates and visualises data from the [Prozorro](https://prozorro.gov.ua), the automatic risk indicators calculation engine and the Prozorro API for monitoring and allows auditors to quickly analyse transactions’ open data by applying multidimensional filtering functionality. Also, a dedicated basket functionality was implemented to keep the procedures and track them by auditors until the official start of monitoring.

Following the completion of the capacity-building training sessions, the staff of the [SASU](http://www.dkrs.gov.ua/kru/en/) responsible for monitoring public procurement in Ukraine, have significantly increased their capabilities in conducting eProcurement audit activities using a new monitoring methodology and analytical tools. 

The project deliverables contribute to improving the CAs procurement practice compliance with regulations, as well as a higher level of the corruption or collusion cases detection by the state controlling authorities, and to reduce the loss of public funds. 

## Impact
By applying of the available analytical functionalities and calculated risk indicators results, displayed live in the user-friendly web-based application, auditors can:
- Conduct a real-time and in-depth analysis of eProcurement transactions;
- Effectively select procurement procedures for monitoring.

## Lessons learnt
Lessons that can be taken from the project:
- Gaining auditors support in the design and testing process is critical for the development of the analytical tool that will meet end-users’ expectations in full.
-	The disscussions should be conducted among the relevant experts aiming at the investigation of public procurement risks and their minimisation through the online monitoring and other means of controls because of the permanent changes in the public procurement control environment and amendments to the related legislation.
-	There is a need for dedicated guidance for efficient and effective monitoring of public procurement procedures. The guidance should include an assessment of the monitoring process effectiveness, including (1) a step by step description of the monitoring process and how to use the developed technology infrastructure, and (2) monitoring process KPIs to measure the effectiveness of the auditors, risky procedures queueing and prioritisation, queue processing, as well as an explanation on how to effectively manage performance.
-	The revising and updating of the developed IT infrastructure for the public procurement monitoring should be conducted to reflect the necessary amendments to the online data-driven monitoring methodology, monitoring process performance assessment, and incorporating automatic reports on the progress of online monitoring effectiveness.
