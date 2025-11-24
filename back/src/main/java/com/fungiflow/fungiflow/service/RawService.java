package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.RawDTO;
import com.fungiflow.fungiflow.model.Raw;
import com.fungiflow.fungiflow.repo.RawRepo;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class RawService {
    @Autowired
    private RawRepo RawRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired 
    private StockService stockService;

    public List<RawDTO> getAllRaws() {
        List<Raw> RawList = RawRepo.findAll();
        return modelMapper.map(RawList,new TypeToken<List<RawDTO>>(){}.getType());
    }
    public RawDTO saveRaw(RawDTO RawDTO) {
        RawRepo.save(modelMapper.map(RawDTO, Raw.class));
        stockService.updateStock(RawDTO.getMaterial());
        return RawDTO;
    }
    public RawDTO updateRaw(RawDTO RawDTO){
        RawRepo.save(modelMapper.map(RawDTO, Raw.class));
        stockService.updateStock(RawDTO.getMaterial());
        return RawDTO;
    }
    public String deleteRaw(Long id){
        Raw Raw = RawRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Raw not found with id: " + id));
    RawRepo.delete(Raw);
    stockService.updateStock(Raw.getMaterial());
    return "Raw Deleted";
    }
    public RawDTO getRawById(Long id) {
        Raw Raw = RawRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw not found with id: " + id));
        return modelMapper.map(Raw, RawDTO.class);
    }
}