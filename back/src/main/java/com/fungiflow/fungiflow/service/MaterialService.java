package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.MaterialDTO;
import com.fungiflow.fungiflow.model.Material;
import com.fungiflow.fungiflow.repo.MaterialRepo;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MaterialService {

    @Autowired
    private MaterialRepo materialRepo;

    @Autowired
    private ModelMapper modelMapper;

    public List<MaterialDTO> getAllMaterials() {
        List<Material> materialList = materialRepo.findAll();
        return modelMapper.map(materialList, new TypeToken<List<MaterialDTO>>() {}.getType());
    }

    public MaterialDTO saveMaterial(MaterialDTO material) {
        Material savedMaterial = (Material) materialRepo.save(modelMapper.map(material, Material.class));
        return modelMapper.map(savedMaterial, MaterialDTO.class);
    }

    public MaterialDTO updateMaterial(MaterialDTO material) {
        Material updatedMaterial = (Material) materialRepo.save(modelMapper.map(material, Material.class));
        return modelMapper.map(updatedMaterial, MaterialDTO.class);
    }

    public String deleteMaterial(MaterialDTO material) {
        materialRepo.deleteById(material.getId());
        return "Material deleted";
    }

    public MaterialDTO getMaterialById(Long id) {
        Optional<Material> materialOptional = materialRepo.findById(id);
        if (materialOptional.isPresent()) {
            return modelMapper.map(materialOptional.get(), MaterialDTO.class);
        } else {
            throw new RuntimeException("Material not found with id: " + id);
        }
    }
}
