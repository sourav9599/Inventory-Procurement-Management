package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.LogsManager;
import com.oildrilling.IMS.models.dataclass.LogsData;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/logs")
@CrossOrigin("*")
public class LogsController {

    private final LogsManager logsManager;

    public LogsController(LogsManager logsManager) {
        this.logsManager = logsManager;
    }

    @GetMapping
    public List<LogsData> getLogsDataListById(@RequestParam String logId){
        return logsManager.getLogsDataListById(logId);
    }
}
