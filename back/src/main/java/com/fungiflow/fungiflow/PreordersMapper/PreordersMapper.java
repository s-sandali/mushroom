package com.fungiflow.fungiflow.PreordersMapper;


import com.fungiflow.fungiflow.dto.PreordersDto;
import com.fungiflow.fungiflow.model.Preorders;
import com.fungiflow.fungiflow.model.Product;

public class PreordersMapper {
    public static PreordersDto mapToPreordersDto(Preorders preorders) {
        if (preorders == null) {
            return null;
        }

        Long productId = null;
        Product product = preorders.getProduct();
        if (product != null) {
            productId = product.getProduct_id();
        }

        return new PreordersDto(
                preorders.getId(),
                preorders.getCustomer_name(),
                preorders.getProduct_name(),
                preorders.getUnit_price(),
                preorders.getQuantity(),
                preorders.getPrice(),
                preorders.getDate(),
                productId
        );
    }

    public static Preorders mapToPreorders(PreordersDto preordersDto) {
        Preorders preorders = new Preorders();
        preorders.setId(preordersDto.getId());
        preorders.setCustomer_name(preordersDto.getCustomer_name());
        preorders.setProduct_name(preordersDto.getProduct_name());
        preorders.setUnit_price(preordersDto.getUnit_price());
        preorders.setQuantity(preordersDto.getQuantity());
        preorders.setPrice(preordersDto.getUnit_price() * preordersDto.getQuantity());
        preorders.setDate(preordersDto.getDate());
        
        // Note: Product will be set by the service layer
        return preorders;
    }
}
