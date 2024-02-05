package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.ProjectManager;
import com.oildrilling.IMS.models.tables.Project;
import com.oildrilling.IMS.models.tables.Vendor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/project")
@CrossOrigin("*")
public class ProjectController {

    private final ProjectManager projectManager;

    public ProjectController(ProjectManager projectManager) {
        this.projectManager = projectManager;
    }

    @PostMapping(consumes = {"*/*"})
    public void addNewProject(@RequestBody Project project){
        projectManager.addNewProject(project);
    }
}
