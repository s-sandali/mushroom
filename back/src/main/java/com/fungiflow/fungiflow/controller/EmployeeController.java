package com.fungiflow.fungiflow.controller;

import com.fungiflow.fungiflow.dto.EmployeeDTO;
import com.fungiflow.fungiflow.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(value = "/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/get")
    public List<EmployeeDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeDTO employeeDTO) {
        if (employeeService.existsByNic(employeeDTO.getNic())) {
            return ResponseEntity.badRequest().body(Map.of("message", "NIC already exists!"));
        }
        employeeService.addEmployee(employeeDTO);
        return ResponseEntity.ok(Map.of("message", "Employee added successfully!"));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }

    @PutMapping("/update/{id}")
    public void updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        employeeService.updateEmployee(id, employeeDTO);
    }

    @GetMapping("/view")
    public EmployeeDTO getEmployeeById(@RequestParam Long id) {
        return employeeService.getEmployeeById(id);
    }
}

