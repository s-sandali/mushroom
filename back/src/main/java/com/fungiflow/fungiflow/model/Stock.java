package com.fungiflow.fungiflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tid;
    private String material;
    private Integer stock;

    @CreationTimestamp
    @Column(name = "date", nullable = false, updatable = false)
    private Date date;
}