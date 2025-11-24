package com.fungiflow.fungiflow.controller;

import com.fungiflow.fungiflow.dto.InvDTO;
import com.fungiflow.fungiflow.service.InvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(value = "api/v2/")
public class InvController {
    @Autowired
    private InvService InvService;

    @GetMapping("/getInvs")
    public List<InvDTO> getInvs() {
        return InvService.getAllInvs();
    }
    @PostMapping("/saveInv")
    public InvDTO saveInv(@RequestBody InvDTO InvDTO) {
        return InvService.saveInv(InvDTO);
    }
    @PutMapping("/updateInv")
    public InvDTO updateInv(@RequestBody InvDTO InvDTO){
        return InvService.updateInv(InvDTO);
    }
    @DeleteMapping("/deleteInv/{nid}")
    public String deleteInv(@PathVariable Long nid){
        return InvService.deleteInv(nid);
    }
    @GetMapping("/getInv/{nid}")
    public InvDTO getInvById(@PathVariable Long nid) {
        return InvService.getInvById(nid);
    }
    @GetMapping("/getInvByUsage/{usageType}")
    public List<InvDTO> getInvByUsageType(@PathVariable String usageType) {
        return InvService.getInvByUsageType(usageType);
    }
}
