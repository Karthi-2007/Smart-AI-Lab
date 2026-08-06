package com.smartlab.repository;

import com.smartlab.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Equipment findByName(String name);
    List<Equipment> findByLaboratoryLabId(Long labId);
}
