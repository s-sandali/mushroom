package com.fungiflow.fungiflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "inv")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Inv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nid;
    
    @Column(nullable = false)
    private String material;
    
    @Column(nullable = false)
    private String usageType;
    
    @Column(name = "used_stock")
    private Integer Used_stock;

    @CreationTimestamp
    @Column(name = "date", nullable = false, updatable = false)
    private Date date;
}
