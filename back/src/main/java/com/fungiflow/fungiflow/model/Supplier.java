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
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sid;
    private String supplier;
    private String material;
    private String address;
    private Integer phone;    

    @CreationTimestamp
    @Column(name = "date", nullable = false, updatable = false)
    private Date date;
}
