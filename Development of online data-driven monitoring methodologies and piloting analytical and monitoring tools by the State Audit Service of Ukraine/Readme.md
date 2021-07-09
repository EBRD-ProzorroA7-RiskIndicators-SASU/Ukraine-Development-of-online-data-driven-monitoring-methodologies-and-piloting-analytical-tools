# Legal Transition Programme

## Development of online data-driven monitoring methodologies and piloting analytical and monitoring tools by the State Audit Service of Ukraine

### Description:

The project aimed to improve the quality of ex-ante control of public spending by designing the methodology for automated risk indicators capable of identifying procurements with risks of the law violation due to error or deliberate actions and the methodology for procurements with risk prioritisation. The methodology was then translated into supporting technologies that can board designed automated algorithms and data analytics: therefore, to yield significant to control effectiveness.

### Project timeline:
Feb 2018 – June 2021

### Project status:
Fully deployed

## Context and problem statement
Based on the Prozorro e-procurement successful pilot, the Ukrainian parliament passed new legislation that came into effect on August 01, 2016, making electronic procurement procedures conducted on Prozorro mandatory for all public bodies in Ukraine. Prozorro system employs the Open Contracting Data Standard (OCDS) as a key instrument for data modelling since the information available in open data and OCDS formats allows its easy analysis and processing. Since Prozorro adoption, a significant amount of public procurement data has been generated. It provided an opportunity to enhance effectiveness, openness, transparency, and compliance in public procurement by establishing risk-based, data-driven monitoring. With the help of donors, international experts, and NGOs, a data-driven monitoring infrastructure began to form in Ukraine, generating the efficient experience of risk-based data-driven monitoring by the public and civil societies. 

In 2016 Transparency International Ukraine started the project of public procurement risk-based monitoring by establishing a Dozorro platform. As a result, more than 25 NGOs regularly used the platform and scrutinised over 10 000 contracts. In the middle of 2017, the Ministry of Economy officially acknowledged the approach. This led to the idea to advocate for the transition to risk-based monitoring on the state level. 

On December 21, 2017, a reformative amendment to the law “On Public Procurement” was adopted, introducing the monitoring of public procurements by independent state controlling authorities. The State Audit Service of Ukraine (the SAS) became responsible for monitoring eProcurements. Furthermore, the Law introduced automated indicators of risks as a trigger to start a procurement procedure monitoring by the SAS and transferred the whole monitoring process into the Prozorro system itself. 

The new Law required setting up a methodology and automated risk indicators, identifying the Law violation in procurements conducted through Prozorro. At that moment, the SAS and the Ministry of Economy did not yet develop appropriate approaches and instruments to support the risk-based public procurement monitoring.  They pondered to source the proper expertise from experts in the field, start building monitoring control processes, and effectively use risk-oriented analysis of the OCDS data from the Prozorro system.  

Public procurement monitoring is a brand-new type of control designed to support successful transaction flow within the eProcurement system and performed by the independent state controlling authority (the SAS).  The process and result of monitoring are designed to have footprints in the Prozorro, so anyone interested can see how the monitoring of transactions goes. Simultaneously, the SAS is busy doing other types of controls, for example, inspections and financial audits. However, these controls heavily deploy manual approaches; therefore, it’s hard to map and quantify the impact for the digital procurements in the country. The monitoring assumes extended application of the automated risk analysis of the Prozorro data. Also, the monitoring itself creates data in the system attached to the transaction; therefore, the control impact is possible to trace.  

## Objectives and vision
Well-designed controls performed by the state authorities ensure compliance with public procurement law and curb corruption and waste by deterrence and detection.  

National Stakeholders were keen to improve the quality of ex-ante control of public spending. The Cabinet of Ministers of Ukraine provided political support, and the Ministry of Economy & Ministry of Finance of Ukraine became the driving forces of transformation. With the help of the EBRD, the transformation began.

The objectives of the initial transformative efforts were to:
- Develop a digital tool to perform all monitoring activities inside of the Prozorro e-procurement system and make monitoring accountable (including initiation of the monitoring, communications between buyers and SAS, registration of decisions etc.);
- Design the methodology for automated risk indicators to identify procurements with risks of the law violation due to error or deliberate actions and the methodology for procurements with risk prioritisation; 
- Develop & implement supporting technologies that can board the above methodologies, therefore to yield significant to control effectiveness: 
  * Indicators engine for automated calculation of data-based risk indicators – for all active tenders, producing real-time results for the entire procurement system.
  * Prioritisation engine for automated selections of procedures with a high-risk score for monitoring by the SAS – allows pushing the frontier of auditors’ ability to spot the riskiest tenders immediately and respond through the monitoring. 
  * Analytical module for auditors, which adds more flexibility in identifying higher risk and inefficiencies in the public procurement processes and system

### Risk indicators methodology development and adoption for the SAS public procurement procedures monitoring purposes

#### Risk indicators methodology 

When designing the methodology for the automated risk indicators, it was aimed to install an approach that would allow the development of public procurement monitoring driven by automated risk indicators and data analytics. Therefore, the risk management concepts and recommendations (ISO, COSO & OECD) became the underpinning background embedded into the fabric of the first set of risk indicators. They were designed in tight cooperation with the SAS. The methodology supports an online analysis of the public procurement OCDS Open Data from the Prozorro system. It references procurement data against developed automated algorithms of red flags and risk indicators. When implemented and expanded, the methodology should aim to be a part of the government’s effective mechanism that helps track procurement decisions, identify potential risks and draw attention to procurement transactions that appear to depart from established norms and regulations.

The methodology is viewing automated indicators of risk as:

* Red flags or irregularities - is when national rules and laws are not respected by the procurement process participants causing an actual breach of norms of the law related to the procurement procedure process and/or potential loss to the public budget through this violation.
* Risk indicators - provide an early signal of increasing risk exposures in various procurement processes and key principles violations such as transparency, competition, non-discrimination, value for money, objectivity, and integrity in tenders evaluation.
* 
The Project team carefully reviewed the requirements placed by the SAS to the automated risk indicators design. They were mainly related to the SAS’s entitled control responsibilities. For example, such risks as a violation of competition and non-discrimination principles are currently beyond the SAS control responsibility; therefore, the SAS could not board risk indicators detecting such risks. At the initial stage, 27 unique algorithms were designed to support indicators implementation, and 19 algorithms in the form of 32 indicators were taken on board for the first run of the approach. One algorithm can be split into two or more indicators and applied to different procurement method types. 

#### Methodology for procedures with risk selection 

The Project team has also designed the methodology that allows risk-weight each procurement procedure with risk and streamline to help the auditor identify and prioritise the riskiest procedures quickly. With the help of this methodology, auditors can get a full picture of procedures’ risk significance. The methodology allows the application of flexible parameters; therefore, auditors can adjust prioritisation logic when such needs exist. The final methodology has been adopted by the Decree of the Ministry of Finance on September 11, 2018, and amended on October 28, 2020. 

#### Methodology amendments

The developed methodology and analytical application for monitoring were officially in use since October 2018. The Public Procurement Law was amended in December 2019, with the amendments coming into force in April 2020. Together with the working group from the state authorities and civil societies, the Project team conducted the performance evaluation for the current approach and assessed the law changes to identify opportunities for the methodology extension. The team revealed areas for improvement for the methodology and technologies and instances where new indicators could be created. The team also managed to address the feedback loop and suggested methodology amendments, redesigned existing indicators, and made new indicators to accommodate the Law changes and improve monitoring performance. The decree of the Ministry of Finance in December 2020 officially adopted suggested changes.

## Technological solution and implementation

The risk engine tool has been designed to access the OCDS database from Prozorro directly through an Application Programming Interface (API). The risk engine allows users to analyse the eProcurement data for monitoring purposes following the risk indicators methodology and provide calculations results through the dedicated API to the users’ interface for further processing. The risk engine was deployed within the Prozorro environment and supplies the indicators information to the Auditors’ Cabinet for monitoring purposes. The Project team deployed another risk engine within the Project piloting environment where the auditors can analyse the data, using the dedicated UI, by many different combinations of risk. The comparative analysis of public tenders and contracting authorities is available by risk and by their performance. The overall result is that auditors have access to eProcurement transaction information assessed by automated indicators for potential irregularities and risks and can use it when deciding on a monitoring routine.

Developed analytical infrastructure for procurement procedures monitoring by the SAS has the following architecture: 






### Prozorro Environment 
#### eProcurement system (ePS)
The public procurement reform in Ukraine has been ongoing for several years, legislative changes were made, and an electronic public procurement system Prozorro was created with the portal https://prozorro.gov.ua/en. Ukraine is on the track of becoming yet another country to adopt eProcurement fully. The ePS is developing continuously and needs to overcome a lot of challenges. However, the Government of Ukraine is actively introducing IT technologies into all business processes in the state administration, and electronic public procurement is one of the essential directions in digital transformation.

#### Risk Engine

* A dedicated module capable of analysing high volumes of real-time consolidated procurement OCDS data automatically runs a set of automated coded algorithms. Obtained results (results of red flags and risk indicators calculation) are stored inside this module. The module keeps the calculation history for each procedure and indicator and makes it available for further processing via API. 
* Queueing and prioritisation module – retrieves the data of red flags and risk indicators calculation results from the risk calculation engine and performs risky procurement transactions queueing as described by the methodology. This module also has the functionality to integrate with external systems or users’ interfaces for results reporting.
* Indicators algorithms library – contains “red flags” and “risk indicators” algorithms, calculation conditions, and parameters. 

Risk engine forms the part of Prozorro, and Prozorro’s technical team supports its functioning. The risk engine works only with officially adopted risk indicators. Risk indicators calculation results are fed to the Auditors’ Cabinet for monitoring. 

#### Auditors’ Cabinet
A working space for auditors developed on the site of the Prozorro system. The cabinet supports monitoring process flow performed by the auditors and creates a data footprint of monitoring instances inside the Prozorro system.

### The SAS Piloting Environment  

#### Analytical “Sandbox”

This module fully replicates the risk engine operations and ensures the appropriate performance of the Risk Engine on the Prozorro side. The “Sandbox” runs the same risk indicators algorithms officially adopted. Any deviations with Prozorro’s Risk Engine can be investigated. This adds significant comfort to the risk engine completeness and accuracy of automated calculation so sought by auditors. The “Sandbox” has additional functionalities that allow auditors to building new hypotheses for risk indicators and risk analytics, then to try and test them on actual procurements data before official approval.

#### Analytical Web-Interface 

This module is developed by the Project team for auditors to calculate automatic risk indicators and aggregated analytics. The Web-Interface consists of various information indicators, charts, and tabular data that use the applied data analytics results, automatic risk indicators and transactional public procurement data as data sources. Web pages include filtering tools to drill down on the data displayed following the requirements of the end-user. Auditors can also evaluate the effectiveness of risk indicators and existing methodologies using dedicated functionality that allows feedback on performance.

#### Data Used
The Prozorro system was developed with an open procurement data format’s perspective, with a fully available API dataset. OCDS became a core stone element of the Prozorro procurement system, assisting in retrieving well-structured data that reflects the complete procurement contracting cycle. All this makes the Prozorro eProcurement data accessible and transparent for various users interested in procurement data access.

The OCDS-like structured eProcurement data is an asset that has a high analytical potential to be effectively used by various state controlling authorities. In Ukraine, the public procurement environment is complex and layered among various state authorities. Therefore, those involved in procurement control need to understand what data is used in analysis and how.

The use of standardised data eased risk indicators development and made it more transparent for key stakeholders. The Project team was able to link each data field appropriately to the procurement transaction’s logic described in the Public Procurement Law. The designing of the risk indicators was not a “black box” exercise for the SAS auditors. The team quickly managed to get to the common view on the mechanics of each indicator. The OCDS data structure allowed a much more precise and clear-cut explanation of each algorithm’s design and performance. 

The automated risk indicators are an instrument the SAS is now using to perform their public procurements controls routine. 

Thanks to the OCDS-like data deployed in each indicator’s fabric, they can be replicated and used by the Accounting Chamber or other stakeholders. For example, it can use a dedicated set of risk indicators to assess the contracting authority’s procurement practice risk and decide to include contracting authorities into the audit plan based on such assessment. 

## Results and future expectations

As a result of the Project, the methodology for electronic public tenders monitoring was developed and piloted. The SAS now has a data-driven audit methodology and the public procurement data analytical infrastructure to support their monitoring activities. The methodology and analytical tools enable a previously impossible level of risk analysis of procurement spending within the country and, at various stages of the digital procurements, control activities. 

In terms of the goals set for the Project, the procurement procedures monitoring methodology and analytical tool:

- Provides a direction for data analytics application during the digital public procurement procedures monitoring based on international best practices, and 
- Enables the controlling authority (the SAS) to conduct the data-driven “ex-ante” control of public procurement transactions.

The Project team observed the approach’s performance for more than two years already. Overall positive uplift of the effectiveness in public procurement control performed by the SAS can be noted. The approach has a great potential to evolve and become a backbone for any public procurement control activity.

The SAS can use dedicated OCDS based indicators to precisely track the instance of the Law and procurement principles violations caused by contracting authorities within the entire eProcurement system. This, in turn, allows the SAS to perform their role as a law enforcement agency more effectively. 

The SAS can learn from the risk data produced by automated indicators and critically assess the existing processes deployed by the Ukrainian public procurement system, and suggest improvements to the legislation based on data-driven evidence.   

The automated data analytics, such as risk indicators, help the controlling authority understand where the risk is located and how significant it may be within the dynamic eProcurement system. Moreover, with the help of standardised OCDS procurement data, the knowledge about risk can reach a common understanding among various controlling authorities. This, in turn, helps to create a solid and continuous risk-fighting partnership across public controlling authorities engaged in the public procurement control process.        

Currently, there are 50 automated risk indicators officially approved for monitoring. The SAS is using them to initiate monitoring of the procedure with risk. The analytical solution (“Sandbox” and Web-Interface) also hosts indicators algorithms and aggregated analytics, which are not serving as an official reason to trigger monitoring; however, the SAS is continually viewing the risk information they produce and use this information to start the monitoring per own initiative, as well as for other types of public procurement controls as a helping source (e.i. inspection and checking).  

The ex-ante monitoring officially started to operate on October 31, 2018. SAS initiated 18 780 ex-ante procurement monitoring between 2018 and 2020 with a total worth of UAH 254 856 million of the estimated value (EUR 8 495 million). They covered 6% out of all above the threshold procedures in the Prozorro system by quantity, and 12% by estimated value. The graph below shows the dynamic of the monitoring instances per each trigger stipulated by the Law,  Sep 2018 - Dec 2020. 

The introduction of the new monitoring approach significantly improved the duration of the process. The median time required to monitor 1 procedure reduced from 26-27 days to 6-10 days. In 2019 median time to monitor 1 procedure was 9 days.










There is a positive year-to-year dynamic of monitoring instances triggered by the risk indicators and the SAS own initiative. However, it took significant time for the officials to accept the amended methodology and the new set of risk indicators after the Law changed in April 2020. Therefore, there is a decreasing trend for monitoring instances triggered by risk indicators from April till December 2020, as some indicators were not applicable anymore.  

The risk indicators analytical system reported that 9% of procurement procedures by quantity and 20% by the estimated value had signs of risks identified by existing automated risk indicators. And it considerably more than was put for monitoring by the auditors. 

The current Law does not stipulate the monitoring of below thresholds procedures. The Project team did not analyse the below threshold procedures above because the SAS were not monitoring this procurement method type. However, the risk indicators analytical system reported 13% of the below threshold procedures with risk by the quantity and 54% or EUR 1,800 million by estimated value. This leaves considerable room for control improvement by the SAS and other controlling authorities. 

The table below summarises procurements monitoring instances a year to year dynamics. 









Going forward, the Project’s impact could be increased by allocating resources and a budget to support the analytical capacity of the auditors to develop a new analytical hypothesis on risk identification and implement them into the digital environment.  The tools and risk indicators now available require a periodic evaluation and need to be assessed for their relevance and effectiveness in a constantly changing environment. The risk information could be used to develop risk responses not just for procedure monitoring purposes but for policymakers in their decisions across different policy fields.

## Costs and requirements
Implementation costs for a similar project may vary depending on many factors. They may include the current state of the public procurement control environment, the Government objectives, and the velocity of the approach developed to maintain and the overall level of public sector digital transformation.

For Ukraine, to reach the current state of the public procurement monitoring maturity, implementation costs comprised about €350 – €400K.
The breakdown of costs is rough as follows:

* Development of the automated risk indicators methodology and procedures with risk prioritisation – €150K. The main variables affecting this cost are building risk condition hypotheses relevant to public procurements in Ukraine, testing this hypothesis, and turning them into effective risk or risk analytics indicators. The costs of similar projects in other countries or other authorities could vary considerably depending on the efforts required to localise the risk indicators and analytics methodology to the risks they should detect. 
* Development of the analytical tool for auditors – €200K. The main factors influencing the cost are the data’s underlying quality, the number of risk indicators, aggregated analytics, and dashboards to be developed.
* Ongoing support of the methodology and developed technologies – €50K. The external experts provided continuing support for the methodology application, data analysis, and technologies. This item’s cost depends on how quickly and effectively the beneficiary authorities build their “in-house” expertise. 

The Project’s first stage lasted for 10 months and resulted in an initial set of risk indicators and a risk engine. The second stage is planned to last for 15 months. The second stage intends to end up with an improved methodology and new set of risk indicators, multifunctional analytical “Sandbox”, a web interface for auditors, and the methodology to evaluate the monitoring effectiveness. In terms of human resources, the Project required joining forces of three separate consulting and technology teams with expertise in risk management, auditing methodologies, development of risk-engine and web applications, and data analysis.

Other vital requirements to perform the Project include the existence of digital procurement systems in the first place. Systems with poorly organised databases and low data quality will require considerably more time and expense to perform the necessary data clearance and setting up functioning data analytics tools. A final essential requirement to perform such a project is to have access to key stakeholders who can explain their control objectives and how the existing eProcurement process is set up, and what the data refers to.

## Challenges and lessons learnt
The main challenges for the Project were related to securing the necessary support from the people and organisations to access the required systems, data, policies, and regulations. It took some time to agree on the design of the risk indicators before their development and deployment. Significant time was spent getting interim feedback from the key beneficiaries on project milestones achieved and managing their expectations on the Project interim results. This can be partially explained by the fact that this is a new concept, and change management should be considered as part of future projects.   

As a separate point, the design approach assumes the risk management framework is developed and employed for the assessment, prevention, and mitigation of risks throughout the public procurement cycle. This is not the case for the Ukrainian procurement sector. The Ukrainian procurement sector is missing clear risk management frameworks, strategies and implementation plans according to relevant international standards. The risk indicators are supposed to be an integral part of the comprehensive risk management framework; however, for this Project, they were developed outside of this framework as the risk management framework is not implemented for the public procurement system in Ukraine.   

Lessons that can be taken from the project include:

- The underlying quality of the data is key – a lack of a data source and the poor quality of data creates significant challenges for the implementation of the approach. It increases the resources needed and pushes the project costs up and reduces the accuracy and reliability of the analytical tools available to the auditors. As a result, there is a significant risk that the auditor’s trust in the developed tools can be seriously undermined. The data quality issues encountered and the limited sources of the data reduced the options to create and implement a range of automated risk indicators that could be used for sufficient identification of risks associated with the procurement process. Prozorro public procurement system demonstrates continuous development. However, a significant part of the procurement information remains hard scanned and placed as an attachment file (approximately 80% of the procurement information). This kind of information is hard to recognise and examine for risk by affordable technologies; therefore, the “human eye” remains the only available option. It does not add value to the process’s effectiveness. Prozorro’s volume of transactions is vast and generated by more than 30 thousand contracting authorities. At the same time, controlling authorities’ capacity is very limited, and automation in the process is key for public procurement control enhancement.  
- When developing methodology and risk indicators, the Project team cooperated with many stakeholders from various organisations. We noted that the perception of risks in public procurements was ranging significantly, and often it depended on individual goals perceived by each stakeholder’s organisation. There was no common understanding and a clear view on public procurements risks among them. Therefore, considerable time was spent discussing various issues. For instance, the approval process for the new indicators took more than one year. There should be a precise formulation and shared understanding of significant risks in public procurement among stakeholders involved in approach development. The controlling authorities should then develop the optimal mitigation strategies for substantial risk, including developing automated risk indicators capable of identifying those risks. The controlling authorities should seek identifying gaps in data that prevent them from creating useful automated risk indicators. The use of OCDS structure can facilitate the data gaps removing efforts.   
- Controlling authorities lack analytics capacity and are not free to apply analytical tools and techniques to perform proper risk identification and assessment using data analysis and risk indicators. The training and capacity-building program, which will explain the approach to the required point, may improve the situation. Besides, a working group of analysts and risk experts can be created to assess risks in Ukraine’s procurement system regularly. They can evaluate the automated risk indicator’s performance and seek opportunities to improve the data to design and implement new indicators that will detect significant risks in the public procurement system of Ukraine.
- None of the control should be a “silo” activity. However, in most cases controlling authorities are not talking to each other; they are not discussing outcomes of the risk indicators calculation, risks in public procurements, and how to treat them. Risk information produced based on OCDS data and analysed by automated risk indicators can be shared among controlling authorities (for example, among the SAS and the Chamber of Accounts), resulting in more effective control measures performed by these organisations. For instance, the SAS may monitor multiple procedures of one contracting authority because indicators keep “blinking” for these procedures. The Chamber of Accounts can include this information and risk indicator outcomes into the risk assessment and decide to audit this contracting authority’s procuring practice and direct influence the cause of unwanted procurement practice.    
- The openness of the risk indicators methodology and calculation results should be adequate. Corruption and fraud schemes are the main problem in the public procurement system in Ukraine. They are generated quickly and smartly. At the same time, the risk indicators calculation results, which are intended for use by the SAS, are open data at the moment. Everyone interested can get these results through the dedicated API. Also, a detailed description of each indicator calculation logic is available in the regulatory documents. These factors create conditions for the wrongdoers, among public procurement practitioners, to adapt their corruption schemes to the risk indicators and stay undiscovered. As a result, the effectiveness of monitoring based on risk indicators can be significantly reduced. It is necessary to carefully research, define, and establish each existing indicator’s typology following its purpose and the procurement risk it indicates. Accordingly, it is necessary to analyse the reasonableness of each indicator’s result to be treated as open data. In their Principles of integrity in public procurement, the OECD recommends not communicating indicators results to the public procurement practitioners to avoid influencing their behaviour. In this regard, the Ministry of Economy, the SAS, and the Ministry of Finance need to revise the open data policy put on the indicators calculation result, being that the current set of indicators is developed for the control conducted by the state controlling authority, namely, the monitoring of the public procurements conducted by the SAS. Potentially some of the indicators methodology and calculations results could be removed from the open domain.
- The methodology and supporting tools of performance assessment will drive further development. For the data-driven methodology and supporting analytical tools to work correctly, a feedback loop should be built into the approach linking back to the performance measurement of the methodology, analytical tools, risk indicators and the auditors’ efforts used. Appropriately established performance management processes will assist ongoing and effective improvements to the methodology and the supporting tools. 
- Training and learnings – training in risk identification, management, mitigation, and communication are central to ensuring that the controlling authorities, including the SAS, understand risks in the public procurement cycle, the ways it can be controlled by applying the methodologies and technologies available and the attitudes and behaviours they need to perform their roles effectively. The purpose of training is to raise awareness of risks and mechanisms, enabling auditors and other stakeholders to identify and control them in their areas of responsibilities and strengthen the public procurement cycle through adequate overseeing of potential risks. 
- Projects should be designed in several phases, allowing the model methodology users to move through the analytics maturity levels naturally and consistently, providing support to grow with their capacity at each level.

## Conclusion and recommendations

The achievements of the desired goals and objectives of the public procurement sector in Ukraine are hugely dependent on how well the control mechanism can address the spectrum of risks to ensure procurement effectiveness. The public procurement online monitoring control has been in operation for more than two years and, as shown above, has demonstrated positive performance dynamics. The risk management concept and data-driven techniques underpin this control operation. Furthermore, the OCDS data structure used to enable the data-driven approach showed a high level of practical application, making procurement data analysis by applying indicators straightforward and easy to employ. Therefore, the monitoring is deemed to be the most advanced but still challenging control in the public procurement environment in Ukraine. 

While the need for effective control has never been higher, one should acknowledge how critical the design and operation of effective public   procurement control systems are and their interface with public procurement stakeholders. One should also be aware that online procurements monitoring is one of the many control procedures established in the public procurement sector. Other controls performed by the SAS and fellow controlling authorities should be equally equipped by data-driven and risk-based analytics and risk indicators to stay relevant. 

For example, the SAS monitors a single procurement transaction; however, if procuring entity keeps generating transactions with the same issues after monitoring occurred, it is more efficient to apply another type of control (for example – audit) which would detect the common source for the erroneous transactions and suggest appropriate remediation actions. Data analytics and risk indicators application can serve as a perfect background for building an effective process for such controls cross-functioning and improving public procurements controls overall effectiveness.  

There are still many challenges to address and, per our opinion, the controlling authorities need to consider the following key directions to evolve the public procurements data-driven control to the highest standards: 

* Establish the risk management process for the Ukrainian public procurement sector in line with the recognised risk management standards (INTOSAI, COSO, ISO3100). The process should identify significant risks and the control measures to reduce those risks. 
* To develop automated risk indicators to become an effective instrument for identifying significant public procurement risks by the SAS and other controlling authorities. The current set of risk indicators do not cover the entire procurement flow; therefore, it should be considered when applying for procurements control. 
* It is worth it for controlling authorities to develop “in-house” capacity and expertise in analysing procurement data for risks and identifying opportunities to build intelligent risk indicators.
* Develop the process to assess the performance of the adopted methodologies and supporting analytical tools for monitoring procurement procedures. The feedback loop should be built into monitoring eProcurement procedures, linking back applied policies, processes, tools, and techniques. The developed performance measurement framework should cover at least the main components of the established monitoring processes and assess its effectiveness when applying the adopted methodology and supporting tools. 
* Improving source data quality and extending data sources for analysis. Namely, improving the quality of data produced by the Prozorro system and searching for an opportunity to integrate with other sources of state information relevant to contracting authorities’ activities.