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

import com.fungiflow.fungiflow.dto.RawDTO;
import com.fungiflow.fungiflow.service.RawService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(value = "api/v1/")
public class RawController {
    @Autowired
    private RawService RawService;

    @GetMapping("/getRaws")
    public List<RawDTO> getRaws() {
        return RawService.getAllRaws();
    }
    @PostMapping("/saveRaw")
    public RawDTO saveRaw(@RequestBody RawDTO RawDTO) {
        return RawService.saveRaw(RawDTO);
    }
    @PutMapping("/updateRaw")
    public RawDTO updateRaw(@RequestBody RawDTO RawDTO){
        return RawService.updateRaw(RawDTO);
    }
    @DeleteMapping("/deleteRaw/{id}")
    public String deleteRaw(@PathVariable Long id){
        return RawService.deleteRaw(id);
    }
    @GetMapping("/getRaw/{id}")
    public RawDTO getRawById(@PathVariable Long id) {
        return RawService.getRawById(id);
    }
}
