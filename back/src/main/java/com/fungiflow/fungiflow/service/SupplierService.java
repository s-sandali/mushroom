package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.SupplierDTO;
import com.fungiflow.fungiflow.model.Supplier;
import com.fungiflow.fungiflow.repo.SupplierRepo;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SupplierService {
    @Autowired
    private SupplierRepo SupplierRepo;

    @Autowired
    private ModelMapper modelMapper;

    public List<SupplierDTO> getAllSuppliers() {
        List<Supplier> SupplierList = SupplierRepo.findAll();
        return modelMapper.map(SupplierList,new TypeToken<List<SupplierDTO>>(){}.getType());
    }
    public SupplierDTO saveSupplier(SupplierDTO SupplierDTO) {
        SupplierRepo.save(modelMapper.map(SupplierDTO, Supplier.class));
        return SupplierDTO;
    }
    public SupplierDTO updateSupplier(SupplierDTO SupplierDTO){
        SupplierRepo.save(modelMapper.map(SupplierDTO, Supplier.class));
        return SupplierDTO;
    }
    public String deleteSupplier(Long sid){
        Supplier Supplier = SupplierRepo.findById(sid)
        .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + sid));
    SupplierRepo.delete(Supplier);
    return "Supplier Deleted";
    }
    public SupplierDTO getSupplierById(Long sid) {
        Supplier Supplier = SupplierRepo.findById(sid)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + sid));
        return modelMapper.map(Supplier, SupplierDTO.class);
    }
}
