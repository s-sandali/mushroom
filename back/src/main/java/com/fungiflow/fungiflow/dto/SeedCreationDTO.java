package com.fungiflow.fungiflow.dto;

import com.fungiflow.fungiflow.model.Seed;

public class SeedCreationDTO {

    private Seed.MushroomType type;
    private int initialQuantity;


    public Seed.MushroomType getType() {
        return type;
    }

    public void setType(Seed.MushroomType type) {
        this.type = type;
    }

    public int getInitialQuantity() {
        return initialQuantity;
    }

    public void setInitialQuantity(int initialQuantity) {
        this.initialQuantity = initialQuantity;
    }

    
}
