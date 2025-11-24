package com.fungiflow.fungiflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.Month;


@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "Sold")
public class Sales {

    // Getter and Setter methods
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Getter
    @Setter
    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Getter
    @Setter
    @Column(name = "product_name", nullable = false)
    private String productName;

    @Getter
    @NotNull
    private double unitPrice;

    @Getter
    @NotNull
    private int quantity;

    @Getter
    @Setter
    private double price;

    @Getter
    @Setter
    @NotNull
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Default constructor
    public Sales() {
        this.quantity = 0;  // Initialize quantity to prevent null
        this.unitPrice = 0.0;  // Initialize unitPrice to prevent null
        this.date = LocalDate.now();  // Initialize date to prevent null
    }

    // Constructor with parameters
    public Sales(String customerName, String productName, Double unitPrice, Integer quantity, LocalDate date) {
        this.customerName = customerName;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.date = date;
        this.price = calculatePrice();  // Automatically calculate price
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
        this.price = calculatePrice();  // Recalculate price when unit price changes
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        this.price = calculatePrice();  // Recalculate price when quantity changes
    }

    // Method to calculate total price
    public Double calculatePrice() {
        return this.unitPrice * this.quantity;
    }

    // Optional: For grouping purposes, you could add a getter to get the month from the date
    public Month getMonth() {
        return this.date.getMonth();
    }

}
