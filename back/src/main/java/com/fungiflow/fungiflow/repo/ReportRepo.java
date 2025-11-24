package com.fungiflow.fungiflow.repo;

import com.fungiflow.fungiflow.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepo extends JpaRepository<Report, Long> {
}
