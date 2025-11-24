package com.fungiflow.fungiflow.model;


import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "branch")

public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long branchId;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String branchName;

    public void setId(Long id) {
    }
}

//     @OneToOne
//     @JoinColumn(name = "manager_id", referencedColumnName = "employeeId")
//     private Employee manager;
// }


