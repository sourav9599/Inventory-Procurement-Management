package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.LogsDAO;
import com.oildrilling.IMS.models.dataclass.LogsData;
import com.oildrilling.IMS.models.tables.Logs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LogsManager {

    private final LogsDAO logsDAO;
    @Autowired
    public LogsManager(LogsDAO logsDAO) {
        this.logsDAO = logsDAO;
    }

    public List<LogsData> getLogsDataListById(String logId) {
        Logs logs = logsDAO.getLogsById(logId);
        if(logs== null){
            return new ArrayList<>();
        }
        return logs.getLogsDataList();
    }
}
