package com.fungiflow.fungiflow.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class MaterialRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MaterialType materialType; // Use shared enum

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String requester;

    private LocalDate requestDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED, FULFILLED
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MaterialType getMaterialType() { return materialType; }
    public void setMaterialType(MaterialType materialType) { this.materialType = materialType; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getRequester() { return requester; }
    public void setRequester(String requester) { this.requester = requester; }

    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
}
