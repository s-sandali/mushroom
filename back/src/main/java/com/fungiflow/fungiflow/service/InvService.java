package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.InvDTO;
import com.fungiflow.fungiflow.model.Inv;
import com.fungiflow.fungiflow.repo.InvRepo;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InvService {
    @Autowired
    private InvRepo InvRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired 
    private StockService stockService;

    public List<InvDTO> getAllInvs() {
        List<Inv> InvList = InvRepo.findAll();
        return modelMapper.map(InvList,new TypeToken<List<InvDTO>>(){}.getType());
    }
    public InvDTO saveInv(InvDTO InvDTO) {
        InvRepo.save(modelMapper.map(InvDTO, Inv.class));
        stockService.updateStock(InvDTO.getMaterial());
        return InvDTO;
    }
    public InvDTO updateInv(InvDTO InvDTO){
        InvRepo.save(modelMapper.map(InvDTO, Inv.class));
        stockService.updateStock(InvDTO.getMaterial());
        return InvDTO;
    }
    public String deleteInv(Long nid){
        Inv Inv = InvRepo.findById(nid)
        .orElseThrow(() -> new RuntimeException("Inv not found with id: " + nid));
    InvRepo.delete(Inv);
    stockService.updateStock(Inv.getMaterial());
    return "Inv Deleted";
    }
    public InvDTO getInvById(Long nid) {
        Inv Inv = InvRepo.findById(nid)
                .orElseThrow(() -> new RuntimeException("Inv not found with id: " + nid));
        return modelMapper.map(Inv, InvDTO.class);
    }   
    public List<InvDTO> getInvByUsageType(String usageType) {
        List<Inv> InvList = InvRepo.findByUsageType(usageType);
        return modelMapper.map(InvList, new TypeToken<List<InvDTO>>(){}.getType());
    }
}
