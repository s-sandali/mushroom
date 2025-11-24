package com.fungiflow.fungiflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fungiflow.fungiflow.dto.SupplierDTO;
import com.fungiflow.fungiflow.service.SupplierService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(value = "api/v3/")
public class SupplierController {
    @Autowired
    private SupplierService SupplierService;

    @GetMapping("/getSuppliers")
    public List<SupplierDTO> getSuppliers() {
        return SupplierService.getAllSuppliers();
    }
    @PostMapping("/saveSupplier")
    public SupplierDTO saveSupplier(@RequestBody SupplierDTO SupplierDTO) {
        return SupplierService.saveSupplier(SupplierDTO);
    }
    @PutMapping("/updateSupplier")
    public SupplierDTO updateSupplier(@RequestBody SupplierDTO SupplierDTO){
        return SupplierService.updateSupplier(SupplierDTO);
    }
    @DeleteMapping("/deleteSupplier/{sid}")
    public String deleteSupplier(@PathVariable Long sid){
        return SupplierService.deleteSupplier(sid);
    }
    @GetMapping("/getSupplier/{sid}")
    public SupplierDTO getSupplierById(@PathVariable Long sid) {
        return SupplierService.getSupplierById(sid);
    }
}
