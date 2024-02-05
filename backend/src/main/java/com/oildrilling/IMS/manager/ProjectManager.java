package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.ProjectDAO;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.tables.Metadata;
import com.oildrilling.IMS.models.tables.Project;
import com.oildrilling.IMS.models.tables.Vendor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ProjectManager {
    private final ProjectDAO projectDAO;
    private final MetadataManager metadataManager;

    public ProjectManager(ProjectDAO projectDAO, MetadataManager metadataManager) {
        this.projectDAO = projectDAO;
        this.metadataManager = metadataManager;
    }

    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    public void addNewProject(Project project) {
        String name = rephrase(project.getName());
        Metadata metadata = metadataManager.getMetadataByName("project");
        List<MetadataDetails> filteredMetadataDetailsList = metadata.getMetadataDetails().stream().filter(data -> Objects.equals(data.getName(), name)).toList();
        if(!filteredMetadataDetailsList.isEmpty())
        {
            throw new IllegalStateException("Project Name: "+ name + " already exists. Please try with a different Project Name.");
        }
        String projectId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        project.setId(projectId);
        project.setName(name);
        Project newProject = projectDAO.save(project);
        List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
        metadataDetailsList.add(MetadataDetails.builder().id(newProject.getId()).name(newProject.getName()).build());
        metadata.setMetadataDetails(metadataDetailsList);
        metadataManager.updateMetadata(metadata);

    }
}
