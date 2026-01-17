package com.badMinz.auth_service.repository;

import com.badMinz.auth_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository<Entity, ID Type>
public interface UserRepository extends JpaRepository<User, Long> {

    // Magic Method: Spring automatically writes the SQL for this!
    // SQL: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Another Magic Method to check if email exists
    // SQL: SELECT COUNT(*) > 0 FROM users WHERE email = ?
    boolean existsByEmail(String email);
}