package com.smartlab.service;

import com.smartlab.entity.Equipment;
import com.smartlab.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id).orElse(null);
    }

    public List<Equipment> getEquipmentByLabId(Long labId) {
        return equipmentRepository.findByLaboratoryLabId(labId);
    }

    public List<Equipment> getEquipmentByDepartment(Long departmentId) {
        return equipmentRepository.findByLaboratoryDepartmentDepartmentId(departmentId);
    }

    public Equipment createEquipment(Equipment equipment) {
        if (equipment.getStatus() == null) {
            equipment.setStatus("Available");
        }
        return equipmentRepository.save(equipment);
    }

    public Equipment updateEquipment(Long id, Equipment equipmentDetails) {
        Equipment equipment = equipmentRepository.findById(id).orElse(null);
        if (equipment != null) {
            equipment.setName(equipmentDetails.getName());
            equipment.setStatus(equipmentDetails.getStatus());
            equipment.setDescription(equipmentDetails.getDescription());
            equipment.setAssetId(equipmentDetails.getAssetId());
            equipment.setCategory(equipmentDetails.getCategory());
            equipment.setPurchaseDate(equipmentDetails.getPurchaseDate());
            equipment.setImageUrl(equipmentDetails.getImageUrl());
            if (equipmentDetails.getLaboratory() != null) {
                equipment.setLaboratory(equipmentDetails.getLaboratory());
            }
            return equipmentRepository.save(equipment);
        }
        return null;
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }
}
