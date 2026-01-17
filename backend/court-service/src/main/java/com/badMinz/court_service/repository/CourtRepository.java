package com.badMinz.court_service.repository;

import com.badMinz.court_service.model.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {

    // Magic Method: Spring generates "SELECT * FROM courts WHERE is_active = true"
    List<Court> findByIsActiveTrue();
}