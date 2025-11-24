package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.Inv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvRepo extends JpaRepository<Inv, Long>{   
    @Query("SELECT COALESCE(SUM(i.Used_stock), 0) FROM Inv i WHERE i.material = :material")
    int getTotalUsageByName(@Param("material") String material);

    List<Inv> findByUsageType(String usageType);    
}
