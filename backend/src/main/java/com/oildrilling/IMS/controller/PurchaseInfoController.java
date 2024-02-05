package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.PurchaseInfoManager;
import com.oildrilling.IMS.models.dataclass.PurchaseInfoData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/purchaseInfo")
@CrossOrigin("*")
public class PurchaseInfoController {
    private final PurchaseInfoManager purchaseInfoManager;
    @Autowired
    public PurchaseInfoController(PurchaseInfoManager purchaseInfoManager) {
        this.purchaseInfoManager = purchaseInfoManager;
    }

    @GetMapping
    public List<PurchaseInfoData> getPurchaseInfoDataListById(@RequestParam String purchaseInfoId,@RequestParam String materialId){
        return purchaseInfoManager.getPurchaseInfoDataListById(purchaseInfoId, materialId);
    }

}
