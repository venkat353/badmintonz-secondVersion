package com.badMinz.court_service.repository;

import com.badMinz.court_service.model.Court;
import com.badMinz.court_service.model.SurfaceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {

    // Magic Method: Spring generates "SELECT * FROM courts WHERE is_active = true"
//    List<Court> findByIsActiveTrue();
    @Query("SELECT c FROM Court c WHERE " +
            "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:surface IS NULL OR c.surfaceType = :surface)")
    List<Court> searchCourts(@Param("search") String search, @Param("surface") SurfaceType surface);
}