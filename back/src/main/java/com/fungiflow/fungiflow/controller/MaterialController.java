package com.fungiflow.fungiflow.controller;


import com.fungiflow.fungiflow.dto.MaterialDTO;
import com.fungiflow.fungiflow.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(value = "api/v3/material")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping("/get")
    public List<MaterialDTO> getAllMaterials() {
        return materialService.getAllMaterials();
    }



    @PostMapping("/add")
    public void saveMaterial(@RequestBody MaterialDTO materialDTO)
    {
        materialService.saveMaterial(materialDTO);
    }

    @PutMapping("/update")
    public void updateMaterial(@RequestBody MaterialDTO materialDTO)
    {
        materialService.updateMaterial(materialDTO);
    }

    @DeleteMapping("/delete")
    public void deleteMaterial(@RequestBody MaterialDTO materialDTO)
    {
        materialService.deleteMaterial(materialDTO);
    }

    @GetMapping("/view")
    public MaterialDTO getMaterialById(@RequestParam Long id) {
        System.out.println("Received id: " + id);
        return materialService.getMaterialById(id);
    }




}
