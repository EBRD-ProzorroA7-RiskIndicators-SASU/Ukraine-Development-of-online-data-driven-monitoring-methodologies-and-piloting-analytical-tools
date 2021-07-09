package com.datapath.site.services.export;

import com.datapath.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.elasticsearchintegration.services.ProcedureFilterService;
import com.datapath.elasticsearchintegration.util.Mapping;
import com.datapath.persistence.entities.Checklist;
import com.datapath.persistence.entities.feedback.*;
import com.datapath.persistence.repositories.feedback.*;
import com.datapath.persistence.service.ChecklistDaoService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.datapath.elasticsearchintegration.util.Mapping.RISK_INDICATORS;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toMap;
import static org.springframework.util.CollectionUtils.isEmpty;

@Slf4j
@Component
@AllArgsConstructor
public class ExcelExportService implements ExportService {

    private final ProcedureFilterService filterService;
    private final ChecklistDaoService checklistDaoService;
    private final FeedbackMonitoringInfoRepository monitoringInfoRepository;
    private final FeedbackResultRepository resultRepository;
    private final FeedbackSummaryRepository summaryRepository;
    private final FeedbackViolationRepository violationRepository;
    private final FeedbackIndicatorRepository indicatorRepository;

    private static final List<String> defaultHeaders = Arrays.asList(
            "ID процедури", "Очікувана вартість", "Ризик бал процедури", "Ранг ризику", "Регіон", "Ризик", "Назва ризику", "Статус процедури",
            "Метод закупівлі", "ЄДР замовника", "Вид замовника", "Код предмету закупівлі процедури", "Назва предмету закупівлі",
            "Розділ Єдиного закупівельного словника", "Назва розділу Єдиного закупівельного словника", "Товари, роботи, послуги",
            "Назва процедури", "Дата процедури", "Назва замовника", "Статус моніторинга", "Наявність скарг", "Наявність відгуку");

    private static List<String> materialHeaders = Arrays.asList(
            "ID процедури", "Назва органу", "Номер документу", "Дата"
    );

    private static final List<String> protocolHeaders = Arrays.asList(
            "ID процедури", "Номер протоколу", "Дата", "Нормативний документ", "Сума протоколу", "Сплачено", "Опис протоколу"
    );

    private static final List<String> feedbackHeaders = Arrays.asList(
            "ID процедури",
            "Номер наказу про моніторинг", "Дата наказу про моніторинг", "Номер наказу про призупинення моніторингу", "Дата призупинення",
            "Дата відкриття провадження по справі", "Номер справи",
            "Сума встновлених порушень, грн.", "Відмінено конкурсні торги, грн.", "Розірвано договорів, грн.", "Повернуто перераховані замовником кошти, грн.",
            "Номер рішення про перевірку", "Дата рішення про перевірку"
    );

    private static final List<String> indicatorHeaders = Arrays.asList(
            "ID процедури", "Iндикатор", "Відгук", "Коментар"
    );

    private static Map<String, KeyValueObject> exportFieldMapping;

    static {
        exportFieldMapping = new HashMap<>();
        exportFieldMapping.put("ID процедури", new KeyValueObject("tenderId", String.class));
        exportFieldMapping.put("Очікувана вартість", new KeyValueObject("expectedValue", String.class));
        exportFieldMapping.put("Ризик бал процедури", new KeyValueObject("tenderRiskScore", Double.class));
        exportFieldMapping.put("Ранг ризику", new KeyValueObject("tenderRiskScoreRank", String.class));
        exportFieldMapping.put("Регіон", new KeyValueObject("region", String.class));
        exportFieldMapping.put("Ризик", new KeyValueObject("indicatorsWithRisk", List.class));
        exportFieldMapping.put("Назва ризику", new KeyValueObject("riskName", List.class));
        exportFieldMapping.put("Статус процедури", new KeyValueObject("tenderStatus", String.class));
        exportFieldMapping.put("Метод закупівлі", new KeyValueObject("procedureType", String.class));
        exportFieldMapping.put("ЄДР замовника", new KeyValueObject("procuringEntityEDRPOU", String.class));
        exportFieldMapping.put("Вид замовника", new KeyValueObject("procuringEntityKind", String.class));
        exportFieldMapping.put("Код предмету закупівлі процедури", new KeyValueObject("cpv", String.class));
        exportFieldMapping.put("Назва предмету закупівлі", new KeyValueObject("cpvName", String.class));
        exportFieldMapping.put("Розділ Єдиного закупівельного словника", new KeyValueObject("cpv2", String.class));
        exportFieldMapping.put("Назва розділу Єдиного закупівельного словника", new KeyValueObject("cpv2Name", String.class));
        exportFieldMapping.put("Товари, роботи, послуги", new KeyValueObject("gsw", String.class));
        exportFieldMapping.put("Назва процедури", new KeyValueObject("tenderName", String.class));
        exportFieldMapping.put("Дата процедури", new KeyValueObject("datePublished", String.class));
        exportFieldMapping.put("Назва замовника", new KeyValueObject("procuringEntityName", String.class));
        exportFieldMapping.put("Статус моніторинга", new KeyValueObject("monitoringStatus", String.class));
        exportFieldMapping.put("Наявність скарг", new KeyValueObject("monitoringAppeal", Boolean.class));
        exportFieldMapping.put("Наявність відгуку", new KeyValueObject("procedureLogType", String.class));
    }

    @Override
    @Transactional
    public byte[] export(List<String> tenderIds, List<String> columns) {

        if (columns == null) {
            columns = defaultHeaders;
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        XSSFWorkbook wb = new XSSFWorkbook();

        List<TenderIndicatorsCommonInfo> forExport = new ArrayList<>();
        List<FeedbackMonitoringInfo> feedbackMonitoringInfos = new ArrayList<>();
        List<FeedbackResult> feedbackResults = new ArrayList<>();
        List<FeedbackSummary> feedbackSummaries = new ArrayList<>();
        List<FeedbackViolation> feedbackViolations = new ArrayList<>();
        List<FeedbackIndicator> feedbackIndicators = new ArrayList<>();

        int count = 0;
        do {
            List<String> tenderIdBatch = tenderIds.stream().skip(count).limit(1000).collect(Collectors.toList());
            forExport.addAll(filterService.getForExport(tenderIdBatch));

            feedbackMonitoringInfos.addAll(monitoringInfoRepository.findByTenderIdIn(tenderIdBatch));
            feedbackResults.addAll(resultRepository.findByTenderIdIn(tenderIdBatch));
            feedbackSummaries.addAll(summaryRepository.findByTenderIdIn(tenderIdBatch));
            feedbackViolations.addAll(violationRepository.findByTenderIdIn(tenderIdBatch));
            feedbackIndicators.addAll(indicatorRepository.findByTenderIdIn(tenderIdBatch));

            count = count + 1000;
        } while (count < tenderIds.size());

        writeTenderData(wb, forExport, columns);
        writeFeedbackData(wb, tenderIds, feedbackMonitoringInfos, feedbackResults, feedbackSummaries, feedbackViolations);
        writeProtocols(wb, feedbackResults);
        writeMaterials(wb, feedbackResults);
        writeIndicators(wb, feedbackIndicators);

        try {
            wb.write(bos);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        return bos.toByteArray();
    }

    private void writeIndicators(XSSFWorkbook wb, List<FeedbackIndicator> feedbackIndicators) {
        String sheetName = "Feedback indicators";
        writeHeaders(wb, sheetName, indicatorHeaders);

        XSSFSheet sheet = wb.getSheet(sheetName);

        int rowNumber = 1;

        for (FeedbackIndicator indicator : feedbackIndicators) {
            XSSFRow row = sheet.createRow(rowNumber++);

            createCellWithValue(row, 0, indicator.getTenderId());
            createCellWithValue(row, 1, String.join(" - ",
                    indicator.getId(),
                    RISK_INDICATORS.get(indicator.getId())));

            if (nonNull(indicator.getIndicatorResponse())) {
                createCellWithValue(row, 2, indicator.getIndicatorResponse().getValue());

            }
            createCellWithValue(row, 3, indicator.getComment());
        }
    }

    private void writeMaterials(XSSFWorkbook wb, List<FeedbackResult> feedbackResults) {
        String sheetName = "Feedback materials";
        writeHeaders(wb, sheetName, materialHeaders);

        XSSFSheet sheet = wb.getSheet(sheetName);

        int rowNumber = 1;

        for (FeedbackResult result : feedbackResults) {

            if (!isEmpty(result.getMaterials())) {
                String tenderId = result.getTenderId();

                for (FeedbackMaterial material : result.getMaterials()) {
                    XSSFRow row = sheet.createRow(rowNumber++);

                    createCellWithValue(row, 0, tenderId);
                    createCellWithValue(row, 1, material.getName());
                    createCellWithValue(row, 2, material.getNumber());
                    if (nonNull(material.getDate())) {
                        processDateCell(wb, row, 3, material.getDate().toString());
                    }
                }
            }
        }
    }

    private void writeProtocols(XSSFWorkbook wb, List<FeedbackResult> feedbackResults) {
        String sheetName = "Feedback protocols";
        writeHeaders(wb, sheetName, protocolHeaders);

        XSSFSheet sheet = wb.getSheet(sheetName);

        int rowNumber = 1;

        for (FeedbackResult result : feedbackResults) {

            if (!isEmpty(result.getProtocols())) {
                String tenderId = result.getTenderId();

                for (FeedbackProtocol protocol : result.getProtocols()) {
                    XSSFRow row = sheet.createRow(rowNumber++);

                    createCellWithValue(row, 0, tenderId);
                    createCellWithValue(row, 1, protocol.getNumber());
                    if (nonNull(protocol.getDate())) {
                        processDateCell(wb, row, 2, protocol.getDate().toString());
                    }
                    createCellWithValue(row, 3, protocol.getDocument());
                    createCellWithValue(row, 4, protocol.getAmount());
                    createCellWithValue(row, 5, protocol.getPaidAmount());
                    createCellWithValue(row, 6, protocol.getDescription());
                }
            }
        }
    }

    private void writeFeedbackData(XSSFWorkbook wb,
                                   List<String> tenderIds,
                                   List<FeedbackMonitoringInfo> feedbackMonitoringInfos,
                                   List<FeedbackResult> feedbackResults,
                                   List<FeedbackSummary> feedbackSummaries,
                                   List<FeedbackViolation> feedbackViolations) {
        String sheetName = "Feedback";
        writeHeaders(wb, sheetName, feedbackHeaders);

        XSSFSheet sheet = wb.getSheet(sheetName);

        Map<String, FeedbackMonitoringInfo> monitoringInfoMap = feedbackMonitoringInfos.stream()
                .collect(toMap(FeedbackMonitoringInfo::getTenderId, Function.identity()));

        Map<String, FeedbackResult> feedbackResultMap = feedbackResults.stream()
                .collect(toMap(FeedbackResult::getTenderId, Function.identity()));

        Map<String, FeedbackSummary> feedbackSummaryMap = feedbackSummaries.stream()
                .collect(toMap(FeedbackSummary::getTenderId, Function.identity()));

        Map<String, FeedbackViolation> feedbackViolationMap = feedbackViolations.stream()
                .collect(toMap(FeedbackViolation::getTenderId, Function.identity()));

        int rowNumber = 1;

        for (String tenderId : tenderIds) {
            XSSFRow row = null;

            FeedbackMonitoringInfo monitoringInfo = monitoringInfoMap.get(tenderId);
            if (nonNull(monitoringInfo)) {
                row = sheet.createRow(rowNumber);
                createCellWithValue(row, 1, monitoringInfo.getNumber());
                if (nonNull(monitoringInfo.getDate())) {
                    processDateCell(wb, row, 2, monitoringInfo.getDate().toString());
                }
                createCellWithValue(row, 3, monitoringInfo.getStopNumber());
                if (nonNull(monitoringInfo.getStopDate())) {
                    processDateCell(wb, row, 4, monitoringInfo.getStopDate().toString());
                }
            }
            FeedbackSummary summary = feedbackSummaryMap.get(tenderId);
            if (nonNull(summary)) {
                if (isNull(row)) {
                    row = sheet.createRow(rowNumber);
                }
                if (nonNull(summary.getDate())) {
                    processDateCell(wb, row, 5, summary.getDate().toString());
                }
                createCellWithValue(row, 6, summary.getNumber());

            }
            FeedbackViolation violation = feedbackViolationMap.get(tenderId);
            if (nonNull(violation)) {
                if (isNull(row)) {
                    row = sheet.createRow(rowNumber);
                }
                createCellWithValue(row, 7, violation.getAmount());
                createCellWithValue(row, 8, violation.getCanceledAmount());
                createCellWithValue(row, 9, violation.getTerminatedAmount());
                createCellWithValue(row, 10, violation.getReturnedAmount());
            }
            FeedbackResult result = feedbackResultMap.get(tenderId);
            if (nonNull(result)) {
                if (isNull(row)) {
                    row = sheet.createRow(rowNumber);
                }
                createCellWithValue(row, 11, result.getNumber());
                if (nonNull(result.getDate())) {
                    processDateCell(wb, row, 12, result.getDate().toString());
                }
            }

            if (nonNull(row)) {
                createCellWithValue(row, 0, tenderId);
                rowNumber++;
            }
        }
    }

    private void createCellWithValue(XSSFRow row, int cellNumber, Object value) {
        XSSFCell cell = row.createCell(cellNumber);
        cell.setCellValue(castToCellValue(value));
    }


    private void writeHeaders(XSSFWorkbook wb, String sheetName, List<String> columns) {
        XSSFSheet sheet = wb.createSheet(sheetName);
        XSSFRow row = sheet.createRow(0);
        int cellNumber = 0;

        for (String column : columns) {
            row.createCell(cellNumber++).setCellValue(column);
        }
    }

    private String getValueByFieldName(TenderIndicatorsCommonInfo info, String fieldName, Class fieldClassName) {

        Class<TenderIndicatorsCommonInfo> className = TenderIndicatorsCommonInfo.class;
        try {
            Field field;
            if (fieldName.equals("riskName")) {
                field = className.getField("indicatorsWithRisk");
            } else {
                field = className.getField(fieldName);
            }
            if (fieldClassName == Boolean.class) {
                return Mapping.APPEAL.get(String.valueOf(field.getBoolean(info))).getValue().toString();
            }
            if (fieldClassName == Double.class) {
                return String.valueOf(field.get(info));
            }
            if (fieldClassName == List.class) {
                Set<String> list = (Set<String>) field.get(info);
                if (list != null) {
                    if (fieldName.equals("riskName")) {
                        return String.join(",", mapIndicatorsName(list));
                    } else {
                        return String.join(",", list);
                    }
                }
            }
            if (fieldClassName == String.class) {
                String stringValue = String.valueOf(field.get(info));

                switch (fieldName) {
                    case "tenderStatus":
                        return Mapping.TENDER_STATUS.get(stringValue).getValue().toString();
                    case "procuringEntityKind":
                        return Mapping.PROCURING_ENTITY_KIND.get(stringValue).getValue().toString();
                    case "procedureType":
                        String datePublished = String.valueOf(className.getField("datePublished").get(info));
                        return Mapping.extractProcedureType(stringValue, datePublished);
                    case "gsw":
                        return Mapping.extractGswValue(stringValue);
                    case "monitoringStatus":
                        return Mapping.MONITORING_STATUS.get(stringValue).getValue().toString();
                    default:
                        return stringValue;
                }
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.error(e.getMessage(), e);
        } catch (NullPointerException e) {
            log.warn("Field '{}' is null in tender '{}'", fieldName, info.getTenderOuterId());
        }
        return null;

    }

    private void writeTenderData(XSSFWorkbook wb, List<TenderIndicatorsCommonInfo> tenders, List<String> columns) {
        String sheetName = "Tenders";

        writeHeaders(wb, sheetName, columns);

        XSSFSheet sheet = wb.getSheet(sheetName);

        for (TenderIndicatorsCommonInfo tender : tenders) {
            XSSFRow row = sheet.createRow(tenders.indexOf(tender) + 1);
            int cellNumber = 0;
            for (String column : columns) {
                String stringExportValue = getValueByFieldName(tender, (String) exportFieldMapping.get(column).getKey(), (Class) exportFieldMapping.get(column).getValue());

                if (nonNull(stringExportValue) && column.equals("Наявність відгуку")) {
                    if (procedureHasChecklist(stringExportValue)) {
                        Checklist checklist = checklistDaoService.findByTenderOuterId(tender.getTenderOuterId());
                        if (nonNull(checklist)) {
                            stringExportValue = checklist.getModifyDate().toString();
                            processDateCell(wb, row, cellNumber, stringExportValue);
                            cellNumber++;
                        }
                    }
                } else if (column.equals("Дата процедури")) {
                    processDateCell(wb, row, cellNumber, stringExportValue);
                    cellNumber++;
                } else {
                    row.createCell(cellNumber++).setCellValue(castToCellValue(stringExportValue));
                }
            }
        }
    }

    private void processDateCell(XSSFWorkbook wb, XSSFRow row, int cellNumber, String stringExportValue) {
        try {
            CellStyle cellStyle = wb.createCellStyle();
            CreationHelper createHelper = wb.getCreationHelper();
            short dateFormat = createHelper.createDataFormat().getFormat("yyyy-dd-MM");
            cellStyle.setDataFormat(dateFormat);
            XSSFCell cell = row.createCell(cellNumber);
            cell.setCellValue(castToDateCellValue(stringExportValue));
            cell.setCellStyle(cellStyle);
        } catch (ParseException e) {
            log.error(e.getMessage(), e);
        }
    }

    private boolean procedureHasChecklist(String procedureLogType) {
        return !procedureLogType.contains("NotAnalyzed");
    }

    private String castToCellValue(Object value) {
        if (value == null) {
            return "";
        }
        return StringUtils.substring(value.toString(), 0, 1000);
    }

    private Date castToDateCellValue(String value) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        if (value == null) {
            return new Date();
        }
        return format.parse(value);
    }

    private List<String> mapIndicatorsName(Collection<String> list) {
        return list.stream().map(item -> RISK_INDICATORS.get(item)).collect(Collectors.toList());
    }
}
