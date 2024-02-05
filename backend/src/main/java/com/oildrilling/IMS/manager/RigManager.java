package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.ComponentDAO;
import com.oildrilling.IMS.dao.RigDAO;
import com.oildrilling.IMS.dao.SubComponentDAO;
import com.oildrilling.IMS.models.data.SubComponentMetadata;
import com.oildrilling.IMS.models.dataclass.ComponentData;
import com.oildrilling.IMS.models.dataclass.SubComponentData;
import com.oildrilling.IMS.models.tables.Component;
import com.oildrilling.IMS.models.tables.Metadata;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.tables.Rig;
import com.oildrilling.IMS.models.tables.SubComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class RigManager {

    private final RigDAO rigDAO;
    private final ComponentDAO componentDAO;
    private final SubComponentDAO subComponentDAO;
    private final MetadataManager metadataManager;
    @Autowired
    public RigManager(RigDAO rigDAO, ComponentDAO componentDAO, SubComponentDAO subComponentDAO, MetadataManager metadataManager) {
        this.rigDAO = rigDAO;
        this.componentDAO = componentDAO;
        this.subComponentDAO = subComponentDAO;
        this.metadataManager = metadataManager;
    }
    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    public void addRig(String rigName, String location, String dateOfInception ) {
        String newRigName = rephrase(rigName);
        String newLocation = rephrase(location);
        Metadata metadata = metadataManager.getMetadataByName("rig");
        List<MetadataDetails> filteredMetadataDetailsList = metadata.getMetadataDetails().stream().filter(data -> Objects.equals(data.getName(), newRigName)).toList();
        if(!filteredMetadataDetailsList.isEmpty())
        {
            throw new IllegalStateException("Rig Name: "+ newRigName + " already exists. Please try with a different Rig Name.");
        }
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        Date date = null;
        try {
            date = sdf.parse(dateOfInception);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        long dateOfInceptionInMillis = date.getTime();
        String rigId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        // add rig to rig table
        Rig newRig = rigDAO.save(Rig.builder().rigId(rigId).rigName(newRigName).location(newLocation)
                .dateOfInception(dateOfInceptionInMillis).componentList(new ArrayList<>()).build());
        // add rig to metadata table
        List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
        metadataDetailsList.add(MetadataDetails.builder().id(newRig.getRigId()).name(newRig.getRigName()).build());
        metadata.setMetadataDetails(metadataDetailsList);
        metadataManager.updateMetadata(metadata);

    }

    public Rig getRigById(String rigId) {
        return rigDAO.getRigById(rigId);
    }

    public void updateRig(Rig reqRig) {
        Rig rig = rigDAO.getRigById(reqRig.getRigId());
        rig.setRigName(reqRig.getRigName());
        rig.setLocation(reqRig.getLocation());
        rig.setDateOfInception(reqRig.getDateOfInception());
        rigDAO.update(rig.getRigId(), rig);
    }
}
