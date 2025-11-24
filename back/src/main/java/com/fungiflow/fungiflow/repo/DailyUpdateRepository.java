package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.DailyUpdate;
import com.fungiflow.fungiflow.model.Seed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DailyUpdateRepository extends JpaRepository<DailyUpdate, Long> {

    List<DailyUpdate> findBySeedId(Long seedId);

    @Query("SELECT MONTH(d.date), SUM(d.successfulToday), SUM(d.contaminatedToday) " +
            "FROM DailyUpdate d " +
            "WHERE YEAR(d.date) = :year AND (:type IS NULL OR d.seed.type = :type) " +
            "GROUP BY MONTH(d.date) ORDER BY MONTH(d.date)")
    List<Object[]> getMonthlyLabStats(@Param("year") int year,
                                      @Param("type") Seed.MushroomType type);
}
