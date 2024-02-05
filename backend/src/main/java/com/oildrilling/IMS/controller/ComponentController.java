package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.ComponentManager;
import com.oildrilling.IMS.models.tables.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/component")
@CrossOrigin("*")
public class ComponentController {
    private final ComponentManager componentManager;
    @Autowired
    public ComponentController(ComponentManager componentManager) {
        this.componentManager = componentManager;
    }

    @PostMapping(consumes = {"*/*"})
    public void addComponent(@RequestBody Component component){
        componentManager.addComponent(component);
    }

    @GetMapping
    public Component getComponentById(@RequestParam String componentId){
        return componentManager.getComponent(componentId);
    }

    @PostMapping("edit")
    public void updateComponent(@RequestBody Component component){
        componentManager.updateComponent(component);
    }

}
