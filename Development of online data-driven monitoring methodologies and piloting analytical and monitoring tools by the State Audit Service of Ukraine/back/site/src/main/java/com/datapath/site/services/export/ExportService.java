package com.datapath.site.services.export;

import java.util.List;

public interface ExportService {

    byte[] export(List<String> tenderIds, List<String> columns);
}
