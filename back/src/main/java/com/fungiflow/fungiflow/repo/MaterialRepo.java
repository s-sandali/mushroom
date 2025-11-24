package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepo extends JpaRepository<Material, Long> {
    List<Material> findByQuantityLessThan(int threshold);
}
