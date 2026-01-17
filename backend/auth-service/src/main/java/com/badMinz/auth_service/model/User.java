package com.badMinz.auth_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity // 1. Tells Hibernate: "Make a table out of this class"
@Table(name = "users") // 2. Best Practice: Table names should be plural and lowercase
@Data // 3. Lombok: Auto-generates Getters, Setters, toString, etc.
@Builder // 4. Design Pattern: Lets us build objects like User.builder().name("...").build()
@NoArgsConstructor // Required by JPA
@AllArgsConstructor
public class User implements UserDetails{

    @Id // Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment (1, 2, 3...)
    private Long id;

    @Column(nullable = false) // SQL Constraint: NOT NULL
    private String name;

    @Column(unique = true, nullable = false) // SQL Constraint: UNIQUE and NOT NULL
    private String email;

    @Column(nullable = false)
    private String password; // This will be hashed (encrypted) later

    @Enumerated(EnumType.STRING) // Saves "ADMIN" as text "ADMIN", not number 0 or 1
    private Role role;

    @CreationTimestamp // Automatically sets time when row is created
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp // Automatically updates time when row is modified
    private LocalDateTime updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email; // We use email as username
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}

