package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.Seed;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeedRepository extends JpaRepository<Seed, Long> {
    List<Seed> findByCultivationCompleteFalse();
}
