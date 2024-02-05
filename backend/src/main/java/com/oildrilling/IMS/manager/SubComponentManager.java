package com.oildrilling.IMS.manager;

import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.model.PublishRequest;
import com.oildrilling.IMS.dao.*;
import com.oildrilling.IMS.models.data.SubComponentMetadata;
import com.oildrilling.IMS.models.dataclass.*;
import com.oildrilling.IMS.models.tables.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SubComponentManager {
    private final SubComponentDAO subComponentDAO;
    private final RigDAO rigDAO;
    private final ComponentDAO componentDAO;
    private final PurchaseInfoDAO purchaseInfoDAO;
    private final LogsDAO logsDAO;
    private final MetadataManager metadataManager;
    private final MaterialRequestManager materialRequestManager;
    @Autowired
    private AmazonSNSClient amazonSNSClient;

    @Autowired
    public SubComponentManager(SubComponentDAO subComponentDAO, RigDAO rigDAO, ComponentDAO componentDAO, PurchaseInfoDAO purchaseInfoDAO, LogsDAO logsDAO, MetadataManager metadataManager, MaterialRequestManager materialRequestManager) {
        this.subComponentDAO = subComponentDAO;
        this.rigDAO = rigDAO;
        this.componentDAO = componentDAO;
        this.purchaseInfoDAO = purchaseInfoDAO;
        this.logsDAO = logsDAO;
        this.metadataManager = metadataManager;
        this.materialRequestManager = materialRequestManager;
    }
    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }
    public void addSubComponent(SubComponent subComponent) {
        String newSubComponentName = rephrase(subComponent.getName());
        String model = rephrase(subComponent.getModel());
        String spec = subComponent.getSpecification();
        Metadata metadata = metadataManager.getMetadataByName("subcomponent");
        List<MetadataDetails> filteredMetadataDetailsList = metadata.getMetadataDetails().stream().filter(data -> Objects.equals(data.getName(), newSubComponentName)).toList();
        if(!filteredMetadataDetailsList.isEmpty())
        {
            throw new IllegalStateException("Sub Component Name: "+ newSubComponentName + " already exists. Please try with a different Sub Component Name.");
        }
        String subComponentId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        subComponent.setId(subComponentId);
        subComponent.setName(newSubComponentName);
        subComponent.setModel(model);
        subComponent.setSubComponentData(new HashMap<>());
        subComponent.setSpareMap(new HashMap<>());
        SubComponent newSubComponent = subComponentDAO.save(subComponent);

        List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
        metadataDetailsList.add(MetadataDetails.builder().id(newSubComponent.getId()).name(newSubComponent.getName()+"-"+ spec).build());
        metadata.setMetadataDetails(metadataDetailsList);
        metadataManager.updateMetadata(metadata);
    }

    public SubComponent getSubComponentById(String subComponentId) {
        return subComponentDAO.getSubComponentById(subComponentId);
    }
    private void sendEmailNotification(String msg, String subject) {
        String topicARN = "arn:aws:sns:us-east-1:636714317761:threshold-alert";
        PublishRequest publishRequest = new PublishRequest(topicARN,msg,subject);
        amazonSNSClient.publish(publishRequest);
    }


    public SubComponent removeSubComponentQuantity(String rigId, String componentId, String subComponentId, int quantity, String comment, String user){
        Rig rig = rigDAO.getRigById(rigId);
        Component component = componentDAO.getComponentById(componentId);
        SubComponent subComponent = subComponentDAO.getSubComponentById(subComponentId);
        String ID = rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId() ;
        Logs logs = logsDAO.getLogsById(ID);

        Map<String, SubComponentMetadata> subComponentMetadataMap = subComponent.getSubComponentData();
        if(subComponentMetadataMap.containsKey(rig.getRigId() +"_"+ component.getId())){
            SubComponentMetadata subComponentMetadata = subComponentMetadataMap.get(rig.getRigId() +"_"+ component.getId());
            int modifiedQuantity = subComponentMetadata.getTotalQuantity() - quantity;
            if(modifiedQuantity < 0){
                throw new IllegalStateException("Remove Quantity is more than available quantity. Quantity Available: " + subComponentMetadata.getTotalQuantity());
            }
            subComponentMetadata.setTotalQuantity(modifiedQuantity);
            if(modifiedQuantity <= subComponent.getReorderPoint())
            {
                String subject = "Reorder Point Reached for Equipment: " + subComponent.getName();
                sendEmailNotification(subComponent.toString(), subject);
                String materialRequestId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                MaterialRequest materialRequest = MaterialRequest.builder()
                        .materialRequestId(materialRequestId)
                        .user("System")
                        .rigId(rigId)
                        .rigName(rig.getRigName())
                        .componentId(componentId)
                        .componentName(component.getName())
                        .subComponentId(subComponentId)
                        .subComponentName(subComponent.getName())
                        .materialId(subComponent.getId())
                        .materialName(subComponent.getName())
                        .quantity(subComponent.getReorderPoint())
                        .comments(List.of(CommentData.builder().user("System").group("System").timestamp(System.currentTimeMillis()).message("Auto MR Generated. \n\nReorder Point Reached for Spare: " + subComponent.getName()).build()))
                        .createdDate(System.currentTimeMillis())
                        .materialType("Equipment")
                        .currentStatus("Pending Approval")
                        .pendingApprovalGroup("Location-Incharge")
                        .build();
                materialRequestManager.createMR(materialRequest);
            }
            subComponentMetadataMap.put(rig.getRigId() +"_"+ component.getId(), subComponentMetadata);
        }
        else{
            throw new IllegalStateException("Equipment doesn't exist in the Rig");
        }
        subComponent.setSubComponentData(subComponentMetadataMap);
        SubComponent updatedSubComponent = subComponentDAO.update(subComponent.getId(), subComponent);

        String logsDataId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        if(logs == null){
            logsDAO.save(Logs.builder().id(ID).logsDataList(new ArrayList<>(List.of(
                    LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Remove").quantity(quantity).logMessage(
                            "Removed "+ quantity +" quantity of "+ subComponent.getName() +" from "+ subComponent.getName() +" in Component "
                                    +component.getName()+" at Rig " + rig.getRigName() + ". Comments: " + comment
                    ).build()))).build());
        }
        else {
            List<LogsData> logsDataList = logs.getLogsDataList();
            logsDataList.add(LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Remove").quantity(quantity).logMessage(
                    "Removed "+ quantity +" quantity of "+ subComponent.getName() +" from "+ subComponent.getName() +" in Component "
                            +component.getName()+" at Rig " + rig.getRigName()  + ". Comments: " + comment
            ).build());
            logs.setLogsDataList(logsDataList);
            logsDAO.update(logs.getId(), logs);
        }
        return updatedSubComponent;
    }


    public SubComponent addSubComponentQuantity(String rigId, String componentId, String subComponentId, int quantity, String user) {
        Rig rig = rigDAO.getRigById(rigId);
        Component component = componentDAO.getComponentById(componentId);
        SubComponent subComponent = subComponentDAO.getSubComponentById(subComponentId);
        String ID = rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId();
        PurchaseInfo purchaseInfo = purchaseInfoDAO.getPurchaseInfoById(ID);
        Logs logs = logsDAO.getLogsById(ID);

        Map<String, SubComponentMetadata> subComponentMetadataMap = subComponent.getSubComponentData();
        if(subComponentMetadataMap.containsKey(rig.getRigId() +"_"+ component.getId())){
            SubComponentMetadata subComponentMetadata = subComponentMetadataMap.get(rig.getRigId() +"_"+ component.getId());
            subComponentMetadata.setTotalQuantity(subComponentMetadata.getTotalQuantity() + quantity);
            subComponentMetadataMap.put(rig.getRigId() +"_"+ component.getId(), subComponentMetadata);
        }
        else{
            subComponentMetadataMap.put(rig.getRigId() +"_"+ component.getId(), SubComponentMetadata.builder()
                    .totalQuantity(quantity).build());
        }
        subComponent.setSubComponentData(subComponentMetadataMap);
        SubComponent updatedSubComponent = subComponentDAO.update(subComponent.getId(), subComponent);

        Map<String, List<MetadataDetails>> componentSubComponentMap = component.getSubComponentMap();
        if(componentSubComponentMap.containsKey(rig.getRigId())){
            List<MetadataDetails> subComponentList = componentSubComponentMap.get(rig.getRigId());
            List<MetadataDetails> filteredSubComponentList = subComponentList.stream().filter(data -> Objects.equals(data.getId(), subComponent.getId())).toList();
            if(filteredSubComponentList.isEmpty()){
                subComponentList.add(MetadataDetails.builder().id(subComponent.getId()).name(subComponent.getName()).build());
                componentSubComponentMap.put(rig.getRigId(), subComponentList);
            }

        }
        else {
            componentSubComponentMap.put(rig.getRigId(), Collections.singletonList(MetadataDetails.builder().id(subComponent.getId()).name(subComponent.getName()).build()));
        }
        component.setSubComponentMap(componentSubComponentMap);
        componentDAO.update(component.getId(), component);

        List<MetadataDetails> componentList = rig.getComponentList();
        List<MetadataDetails> filteredComponentList = componentList.stream().filter(data -> Objects.equals(data.getId(), component.getId())).toList();
        if(filteredComponentList.isEmpty()){
            componentList.add(MetadataDetails.builder().id(component.getId()).name(component.getName()).build());
            rig.setComponentList(componentList);
            rigDAO.update(rig.getRigId(), rig);
        }


        String logsDataId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        if(logs == null){
            logsDAO.save(Logs.builder().id(ID).logsDataList(new ArrayList<>(List.of(
                    LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Add").quantity(quantity).logMessage(
                            "Added "+ quantity +" quantity of "+ subComponent.getName() +" in Component "
                                    +component.getName()+" at Rig " + rig.getRigName()
                    ).build()))).build());
        }
        else {
            List<LogsData> logsDataList = logs.getLogsDataList();
            logsDataList.add(LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Add").quantity(quantity).logMessage(
                    "Added "+ quantity +" quantity of " + subComponent.getName() +" in Component "
                            +component.getName()+" at Rig " + rig.getRigName()
            ).build());
            logs.setLogsDataList(logsDataList);
            logsDAO.update(logs.getId(), logs);
        }
        return updatedSubComponent;
    }


    public void updateSubComponentDetails(String rigId, String componentId, String subComponentId, SubComponentMetadata reqSubComponentMetadata) {
        Rig rig = rigDAO.getRigById(rigId);
        SubComponent subComponent = subComponentDAO.getSubComponentById(subComponentId);
        Component component = componentDAO.getComponentById(componentId);

        Map<String, SubComponentMetadata> subComponentMetadataMap = subComponent.getSubComponentData();
        SubComponentMetadata subComponentMetadata = subComponentMetadataMap.get(rig.getRigId() +"_"+ component.getId());
        subComponentMetadata.setDetailsOfTesting(reqSubComponentMetadata.getDetailsOfTesting());
        subComponentMetadata.setWorksRequired(reqSubComponentMetadata.getWorksRequired());
        subComponentMetadataMap.put(rig.getRigId() +"_"+ component.getId(), subComponentMetadata);
        subComponent.setSubComponentData(subComponentMetadataMap);

        subComponentDAO.update(subComponent.getId(), subComponent);
    }

    public void updateSubComponent(SubComponent reqSubComponent) {
        SubComponent subComponent = subComponentDAO.getSubComponentById(reqSubComponent.getId());
        subComponent.setName(reqSubComponent.getName());
        subComponent.setDescription(reqSubComponent.getDescription());
        subComponent.setSpecification(reqSubComponent.getSpecification());
        subComponent.setModel(reqSubComponent.getModel());
        subComponent.setReorderPoint(reqSubComponent.getReorderPoint());
        subComponentDAO.update(subComponent.getId(), subComponent);

    }
}
