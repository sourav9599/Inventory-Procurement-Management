package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.*;
import com.oildrilling.IMS.models.dataclass.CommentData;
import com.oildrilling.IMS.models.dataclass.PurchaseInfoData;
import com.oildrilling.IMS.models.dataclass.Quotation;
import com.oildrilling.IMS.models.tables.*;
import com.oildrilling.IMS.utils.SNSUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MaterialRequestManager {
    private final ComponentManager componentManager;
    private final RigManager rigManager;
    private final SubComponentDAO subComponentDAO;

    private final ProjectDAO projectDAO;
    private final ManufacturerManager manufacturerManager;
    private final ApprovalGroupManager approvalGroupManager;
    private final ApprovalChainsManager approvalChainsManager;

    private final MaterialRequestDAO materialRequestDAO;
    private final PurchaseInfoDAO purchaseInfoDAO;
    private final QuotationDAO quotationDAO;

    private final SNSUtils snsUtils;

    @Autowired
    public MaterialRequestManager(ComponentManager componentManager,
                                  RigManager rigManager,
                                  SubComponentDAO subComponentDAO, ProjectDAO projectDAO, ManufacturerManager manufacturerManager,
                                  ApprovalGroupManager approvalGroupManager, ApprovalChainsManager approvalChainsManager,
                                  MaterialRequestDAO materialRequestDAO, PurchaseInfoDAO purchaseInfoDAO, QuotationDAO quotationDAO, SNSUtils snsUtils) {
        this.componentManager = componentManager;
        this.rigManager = rigManager;
        this.subComponentDAO = subComponentDAO;


        this.projectDAO = projectDAO;
        this.manufacturerManager = manufacturerManager;
        this.approvalGroupManager = approvalGroupManager;
        this.approvalChainsManager = approvalChainsManager;

        this.materialRequestDAO = materialRequestDAO;
        this.purchaseInfoDAO = purchaseInfoDAO;
        this.quotationDAO = quotationDAO;
        this.snsUtils = snsUtils;
    }
    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    public List<MaterialRequest> getAllMaterialRequests(){
        return materialRequestDAO.getAllMaterialRequest();
    }

    public String createMR(MaterialRequest materialRequest){

        materialRequestDAO.save(materialRequest);
        approvalGroupManager.addMaterialRequest(materialRequest.getPendingApprovalGroup(), materialRequest.getMaterialRequestId());
        snsUtils.sendEmailNotification(materialRequest.toString(),"Approval Request: " + materialRequest.getMaterialRequestId(),materialRequest.getPendingApprovalGroup());
        return materialRequest.getMaterialRequestId();
    }

    public String addMaterialRequest(String rigId, String componentId, String subComponentId,
                                     int quantity, List<CommentData> comment, String materialId, String materialName,
                                     long deadline, String groupName, String manufacturerId, String materialType, String projectId) {
        String materialRequestId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String rigName = rigManager.getRigById(rigId).getRigName();
        String componentName = componentManager.getComponent(componentId).getName();
        String subComponentName = subComponentDAO.getSubComponentById(subComponentId).getName();
        String manufacturerName = manufacturerManager.getManufacturer(manufacturerId).getName();
        String projectName = projectDAO.getProjectById(projectId).getName();
        ApprovalChains approvalChains = approvalChainsManager.getApprovalChain(rigId);
        String newGroupName = approvalChains.getGroups().get(
                approvalChains.getGroups().indexOf(groupName) + 1);

        MaterialRequest materialRequest = MaterialRequest.builder()
                .materialRequestId(materialRequestId)
                .user(comment.get(0).getUser())
                .rigId(rigId)
                .rigName(rigName)
                .componentId(componentId)
                .componentName(componentName)
                .subComponentId(subComponentId)
                .subComponentName(subComponentName)
                .materialId(materialId)
                .materialName(materialName)
                .quantity(quantity)
                .comments(comment)
                .createdDate(System.currentTimeMillis())
                .deadline(deadline)
                .manufacturerId(manufacturerId)
                .manufacturerName(manufacturerName)
                .materialType(materialType)
                .currentStatus("Pending Approval")
                .pendingApprovalGroup(newGroupName)
                .projectId(projectId)
                .projectName(projectName)
                .build();

        materialRequestDAO.save(materialRequest);
        approvalGroupManager.addMaterialRequest(newGroupName, materialRequestId);
        snsUtils.sendEmailNotification(materialRequest.toString(),"Approval Request: " + materialRequest.getMaterialRequestId(),newGroupName);
        return materialRequest.getMaterialRequestId();
    }

    public void approveMaterialRequest(String materialRequestId, String groupName, String comment, String user) {
        MaterialRequest materialRequest = materialRequestDAO.getMaterialRequest(materialRequestId);
        if(materialRequest==null) {
            return;
        }
        ApprovalChains approvalChains = approvalChainsManager.getApprovalChain(materialRequest.getRigId());
        String newGroupName = "";

        if (materialRequest.getComments() == null) {
            materialRequest.setComments(Collections.singletonList(CommentData.builder().user(user).group(groupName).timestamp(System.currentTimeMillis()).message(comment).build()));
        } else {
            materialRequest.getComments().add(CommentData.builder().user(user).group(groupName).timestamp(System.currentTimeMillis()).message(comment).build());
        }

        if (approvalChains.getGroups().indexOf(groupName) == approvalChains.getGroups().size() -1) {
            materialRequest.setCurrentStatus("APPROVED");
            addPurchaseInfo(materialRequest);
        } else {
            newGroupName = approvalChains.getGroups().get(
                    approvalChains.getGroups().indexOf(groupName) + 1);
            materialRequest.setPendingApprovalGroup(newGroupName);
        }

        System.out.println("material request" + materialRequest);
        System.out.println("groupname"  + groupName);
        System.out.println("new group name" + newGroupName);
        materialRequestDAO.save(materialRequest);

        approvalGroupManager.removeMaterialRequest(groupName, materialRequestId);
        approvalGroupManager.addMaterialRequest(newGroupName, materialRequestId);
        if(!newGroupName.isEmpty()){
            snsUtils.sendEmailNotification(materialRequest.toString(),"Approval Request: " + materialRequest.getMaterialRequestId(),newGroupName);
        }


    }

    private void addPurchaseInfo(MaterialRequest materialRequest) {
        Quotations quotations = quotationDAO.getQuote(materialRequest.getRigId() + "_" + materialRequest.getMaterialRequestId());
        List<Quotation> quotationsList = quotations.getQuotationList();
        List<Quotation> filteredQuotationsList = quotationsList.stream().filter(data -> Objects.equals(data.getId(), quotations.getAcceptedQuoteId())).toList();
        Quotation acceptedQuote = filteredQuotationsList.get(0);

        String ID = materialRequest.getRigId() + "_" + materialRequest.getComponentId() + "_" + materialRequest.getSubComponentId();
        if(Objects.equals(materialRequest.getMaterialType(), "Equipment")){
            ID = materialRequest.getRigId() + "_" + materialRequest.getComponentId();
        }
        PurchaseInfo purchaseInfo = purchaseInfoDAO.getPurchaseInfoById(materialRequest.getMaterialId());
        if(purchaseInfo == null){
            Map<String, List<PurchaseInfoData>> purchaseInfoDataMap = new HashMap<>();
            purchaseInfoDataMap.put(ID, Collections.singletonList(PurchaseInfoData.builder()
                    .id(materialRequest.getMaterialRequestId())
                    .manufacturerName(materialRequest.getManufacturerName())
                    .manufacturerId(materialRequest.getManufacturerId())
                    .vendorName(acceptedQuote.getVendorName())
                    .vendorId(acceptedQuote.getVendorId())
                    .projectAssociatedName(materialRequest.getProjectName())
                    .projectAssociatedId(materialRequest.getProjectId())
                    .quantity(materialRequest.getQuantity())
                    .price(acceptedQuote.getPrice())
                    .tax(acceptedQuote.getTax())
                    .date(acceptedQuote.getDeliveryDate())
                    .build()));
            purchaseInfoDAO.save(PurchaseInfo.builder().id(materialRequest.getMaterialId()).purchaseInfoDataMap(purchaseInfoDataMap).build());
        }
        else {
            Map<String, List<PurchaseInfoData>> purchaseInfoDataMap = purchaseInfo.getPurchaseInfoDataMap();
            if(purchaseInfoDataMap.containsKey(ID)){
                List<PurchaseInfoData> purchaseInfoDataList = purchaseInfoDataMap.get(ID);
                purchaseInfoDataList.add(PurchaseInfoData.builder()
                        .id(materialRequest.getMaterialRequestId())
                        .manufacturerName(materialRequest.getManufacturerName())
                        .manufacturerId(materialRequest.getManufacturerId())
                        .vendorName(acceptedQuote.getVendorName())
                        .vendorId(acceptedQuote.getVendorId())
                        .projectAssociatedName(materialRequest.getProjectName())
                        .projectAssociatedId(materialRequest.getProjectId())
                        .quantity(materialRequest.getQuantity())
                        .price(acceptedQuote.getPrice())
                        .tax(acceptedQuote.getTax())
                        .date(acceptedQuote.getDeliveryDate())
                        .build());
                purchaseInfoDataMap.put(ID, purchaseInfoDataList);
            }
            else {
                purchaseInfoDataMap.put(ID, Collections.singletonList(PurchaseInfoData.builder()
                        .id(materialRequest.getMaterialRequestId())
                        .manufacturerName(materialRequest.getManufacturerName())
                        .manufacturerId(materialRequest.getManufacturerId())
                        .vendorName(acceptedQuote.getVendorName())
                        .vendorId(acceptedQuote.getVendorId())
                        .projectAssociatedName(materialRequest.getProjectName())
                        .projectAssociatedId(materialRequest.getProjectId())
                        .quantity(materialRequest.getQuantity())
                        .price(acceptedQuote.getPrice())
                        .tax(acceptedQuote.getTax())
                        .date(acceptedQuote.getDeliveryDate())
                        .build()));
            }
            purchaseInfo.setPurchaseInfoDataMap(purchaseInfoDataMap);
            purchaseInfoDAO.update(purchaseInfo.getId(), purchaseInfo);
        }
    }

    public void denyMaterialRequest(String materialRequestId, String groupName, String comment, String targetGroupName, String user) {
        MaterialRequest materialRequest = materialRequestDAO.getMaterialRequest(materialRequestId);
        ApprovalChains approvalChains = approvalChainsManager.getApprovalChain(materialRequest.getRigId());
        materialRequest.getComments().add(CommentData.builder().user(user).group(groupName).timestamp(System.currentTimeMillis()).message(comment).build());
        if (approvalChains.getGroups().indexOf(groupName) == 0) {
            return;
        } else {
            materialRequest.setPendingApprovalGroup(targetGroupName);
            approvalGroupManager.removeMaterialRequest(groupName, materialRequestId);
            approvalGroupManager.addMaterialRequest(targetGroupName, materialRequestId);
        }

        materialRequestDAO.save(materialRequest);
        snsUtils.sendEmailNotification(materialRequest.toString(),"Request Denied: " + materialRequest.getMaterialRequestId(),targetGroupName);
    }

    public List<MaterialRequest> getPendingApprovals(String groupName) {
        List<MaterialRequest> materialRequests = new ArrayList<>();
        ApprovalGroups approvalGroups = approvalGroupManager.getApprovalGroup(groupName);
        if (approvalGroups != null && approvalGroups.getPendingMaterialRequests() != null
                && !approvalGroups.getPendingMaterialRequests().isEmpty()) {
            approvalGroups.getPendingMaterialRequests().forEach(materialRequestId -> {
                materialRequests.add(materialRequestDAO.getMaterialRequest(materialRequestId));
            });
        }
        return materialRequests;
    }


}
