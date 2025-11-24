package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.EmployeeDTO;
import com.fungiflow.fungiflow.model.Employee;
import com.fungiflow.fungiflow.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepo employeeRepo;

    public EmployeeDTO addEmployee(EmployeeDTO dto) {
        validateNICAndPhone(dto);

        // Check if NIC already exists
        if (employeeRepo.existsByNic(dto.getNic())) {
            throw new IllegalArgumentException("NIC already exists!");
        }

        Employee employee = dtoToEntity(dto);
        return entityToDTO(employeeRepo.save(employee));
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepo.findAll()
                .stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    public void deleteEmployee(Long id) {
        employeeRepo.deleteById(id);
    }

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee existing = employeeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        validateNICAndPhone(dto);

        // Check if NIC is being changed to an existing NIC
        if (!existing.getNic().equals(dto.getNic()) && employeeRepo.existsByNic(dto.getNic())) {
            throw new IllegalArgumentException("NIC already exists!");
        }

        existing.setName(dto.getName());
        existing.setNic(dto.getNic());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());
        existing.setSex(dto.getSex());
        existing.setRole(dto.getRole());

        return entityToDTO(employeeRepo.save(existing));
    }

    private void validateNICAndPhone(EmployeeDTO dto) {
        if (dto.getPhone() == null || dto.getPhone().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        if (!dto.getPhone().matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Phone number must be 10 digits");
        }
        if (!dto.getNic().matches("^(\\d{9}[vV]|\\d{12})$")) {
            throw new IllegalArgumentException("Invalid NIC number");
        }
    }

    private Employee dtoToEntity(EmployeeDTO dto) {
        return Employee.builder()
                .id(dto.getId())
                .name(dto.getName())
                .nic(dto.getNic())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .sex(dto.getSex())
                .role(dto.getRole())
                .build();
    }

    private EmployeeDTO entityToDTO(Employee emp) {
        return EmployeeDTO.builder()
                .id(emp.getId())
                .name(emp.getName())
                .nic(emp.getNic())
                .phone(emp.getPhone())
                .address(emp.getAddress())
                .sex(emp.getSex())
                .role(emp.getRole())
                .build();
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Optional<Employee> employee = employeeRepo.findById(id);
        if (employee.isPresent()) {
            return entityToDTO(employee.get());
        }
        throw new RuntimeException("Employee not found");
    }

    public boolean existsByNic(String nic) {
        return employeeRepo.existsByNic(nic);
    }
}
