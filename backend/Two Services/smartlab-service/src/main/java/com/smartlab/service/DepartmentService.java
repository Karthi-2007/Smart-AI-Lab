package com.smartlab.service;

import com.smartlab.entity.Department;
import com.smartlab.repository.DepartmentRepository;
import com.smartlab.repository.FacultyRepository;
import com.smartlab.repository.StudentRepository;
import com.smartlab.repository.LaboratoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final LaboratoryRepository laboratoryRepository;

    public DepartmentService(DepartmentRepository departmentRepository,
                             FacultyRepository facultyRepository,
                             StudentRepository studentRepository,
                             LaboratoryRepository laboratoryRepository) {
        this.departmentRepository = departmentRepository;
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;
        this.laboratoryRepository = laboratoryRepository;
    }

    private Department populateDepartmentCounts(Department dept) {
        if (dept != null && dept.getDepartmentId() != null) {
            Long deptId = dept.getDepartmentId();
            dept.setFacultyCount(facultyRepository.countByDepartmentDepartmentId(deptId));
            dept.setStudentCount(studentRepository.countByDepartmentDepartmentId(deptId));
            dept.setLabCount(laboratoryRepository.countByDepartmentDepartmentId(deptId));
            if (dept.getStatus() == null) {
                dept.setStatus("ACTIVE");
            }
        }
        return dept;
    }

    public List<Department> getAllDepartments() {
        List<Department> list = departmentRepository.findAll();
        list.forEach(this::populateDepartmentCounts);
        return list;
    }

    public Department getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id).orElse(null);
        return populateDepartmentCounts(dept);
    }

    public Department createDepartment(Department department) {
        if (department.getCode() == null || department.getCode().isBlank()) {
            department.setCode("DEPT-" + System.currentTimeMillis() % 1000);
        }
        if (department.getStatus() == null) {
            department.setStatus("ACTIVE");
        }
        Department saved = departmentRepository.save(department);
        return populateDepartmentCounts(saved);
    }

    public Department updateDepartment(Long id, Department departmentDetails) {
        Department dept = departmentRepository.findById(id).orElse(null);
        if (dept != null) {
            dept.setName(departmentDetails.getName());
            if (departmentDetails.getCode() != null) {
                dept.setCode(departmentDetails.getCode());
            }
            dept.setHod(departmentDetails.getHod());
            dept.setStatus(departmentDetails.getStatus());
            Department saved = departmentRepository.save(dept);
            return populateDepartmentCounts(saved);
        }
        return null;
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
