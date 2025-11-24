package com.fungiflow.fungiflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Seed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MushroomType type;

    @Column(nullable = false)
    private int initialQuantity;

    private int successfulGrowth;
    private int contaminatedCount;

    @Column(nullable = false)
    private LocalDate cultivationStartDate;
    private LocalDate cultivationEndDate;

    private boolean cultivationComplete;


    public enum MushroomType {
        OYSTER(14), SHIITAKE(21), PORTABELLA(18), MAITAKE(25), LIONS_MANE(17);
        public final int growthDays;
        MushroomType(int growthDays) { this.growthDays = growthDays; }
    }
}