package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.ComponentDAO;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.tables.Component;
import com.oildrilling.IMS.models.tables.Metadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ComponentManager {
    private final MetadataManager metadataManager;
    private final ComponentDAO componentDAO;
    @Autowired
    public ComponentManager(MetadataManager metadataManager, ComponentDAO componentDAO) {
        this.metadataManager = metadataManager;
        this.componentDAO = componentDAO;
    }

    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }
    public Component getComponent (String componentId) {
        return componentDAO.getComponentById(componentId);
    }
    public void addComponent(Component reqComponent) {
        String newComponentName = rephrase(reqComponent.getName());
        Metadata metadata = metadataManager.getMetadataByName("component");
        List<MetadataDetails> filteredMetadataDetailsList = metadata.getMetadataDetails().stream().filter(data -> Objects.equals(data.getName(), newComponentName)).toList();
        if(!filteredMetadataDetailsList.isEmpty())
        {
            throw new IllegalStateException("Component Name: "+ newComponentName + " already exists. Please try with a different Component Name.");
        }

        String componentId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        Component newComponent = componentDAO.save(Component.builder().id(componentId).name(newComponentName).description(reqComponent.getDescription()).subComponentMap(new HashMap<>()).build());

        List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
        metadataDetailsList.add(MetadataDetails.builder().id(newComponent.getId()).name(newComponent.getName()).build());
        metadata.setMetadataDetails(metadataDetailsList);
        metadataManager.updateMetadata(metadata);
    }

    public void updateComponent(Component reqComponent) {
        Component component = componentDAO.getComponentById(reqComponent.getId());
        component.setDescription(reqComponent.getDescription());
        component.setName(reqComponent.getName());
        componentDAO.update(component.getId(), component);
    }
}
