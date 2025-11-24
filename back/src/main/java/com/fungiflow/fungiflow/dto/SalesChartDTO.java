package com.fungiflow.fungiflow.dto;

import java.util.Objects;

public class SalesChartDTO {
    private String productName;
    private Integer quantity;
    private String month;

    // Default constructor
    public SalesChartDTO() {}

    // Parameterized constructor
    public SalesChartDTO(String productName, Integer quantity, String month) {
        this.productName = productName;
        this.quantity = quantity;
        this.month = month;
    }

    // Getter and Setter for productName
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    // Getter and Setter for quantity
    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    // Getter and Setter for month
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    // Override toString for better logging/debugging
    @Override
    public String toString() {
        return "SalesChartDTO{" +
                "productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", month='" + month + '\'' +
                '}';
    }

    // Override equals and hashCode for comparing DTO objects and storing in collections like Set
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SalesChartDTO that = (SalesChartDTO) o;
        return Objects.equals(productName, that.productName) &&
                Objects.equals(quantity, that.quantity) &&
                Objects.equals(month, that.month);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productName, quantity, month);
    }
}
