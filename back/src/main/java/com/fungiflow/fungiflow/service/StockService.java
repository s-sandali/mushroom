package com.fungiflow.fungiflow.service;

import com.fungiflow.fungiflow.dto.StockDTO;
import com.fungiflow.fungiflow.model.Stock;
import com.fungiflow.fungiflow.repo.InvRepo;
import com.fungiflow.fungiflow.repo.RawRepo;
import com.fungiflow.fungiflow.repo.StockRepo;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {
    @Autowired
    private StockRepo StockRepo;

    @Autowired 
    private RawRepo RawRepo;

    @Autowired 
    private InvRepo InvRepo;

    public void updateStock(String material) {
        int totalAdded = RawRepo.getTotalRawStockByName(material);
        int totalUsed = InvRepo.getTotalUsageByName(material);
        int currentStock = totalAdded - totalUsed;

        if (currentStock < 0) {
            throw new RuntimeException("Stock for " + material + " is not enough!");
        }        

        Stock stock = StockRepo.findByMaterial(material)
                .orElseGet(() -> {
                    Stock s = new Stock();
                    s.setMaterial(material);
                    return s;
                });

        stock.setStock(currentStock);
        StockRepo.save(stock);
    }

    @Autowired
    private ModelMapper modelMapper;

    public List<StockDTO> getAllStocks() {
        List<Stock> StockList = StockRepo.findAll();
        return modelMapper.map(StockList,new TypeToken<List<StockDTO>>(){}.getType());
    }  
}