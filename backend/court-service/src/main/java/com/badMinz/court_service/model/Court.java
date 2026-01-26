//package com.badMinz.court_service.model;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Entity
//@Table(name = "courts")
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class Court {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name; // e.g., "Court A"
//
//    @Enumerated(EnumType.STRING)
//    private SurfaceType surfaceType; // WOODEN, SYNTHETIC, RUBBER
//
//    @Column(nullable = false)
//    private BigDecimal pricePerHour; // Use BigDecimal for money, NEVER double!
//
//    // THE SOFT DELETE FIELD
//    @Builder.Default
//    @Column(nullable = false)
//    private Boolean isActive = true; // Default to true
//
//    @CreationTimestamp
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    private LocalDateTime updatedAt;
//
//    @OneToMany(mappedBy = "court", cascade = CascadeType.ALL)
//    private List<Timeslot> timeslots;
//}
//



//================================================  NEW ONE  ============================================

//
//package com.badMinz.court_service.model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Entity
//@Table(name = "courts")
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class Court {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name; // e.g., "Court A"
//
//    @Enumerated(EnumType.STRING)
//    private SurfaceType surfaceType; // WOODEN, SYNTHETIC, RUBBER
//
//    @Column(nullable = false)
//    private BigDecimal pricePerHour; // Use BigDecimal for money, NEVER double!
//
//    // THE SOFT DELETE FIELD
//    @Builder.Default
//    @Column(nullable = false)
//    private Boolean isActive = true; // Default to true
//
//    @CreationTimestamp
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    private LocalDateTime updatedAt;
//
//    // IMPORTANT: @JsonIgnore prevents fetching the entire calendar when we just want court info
//    // It also prevents "Infinite Recursion" errors (Court -> Timeslot -> Court -> Timeslot...)
//    @OneToMany(mappedBy = "court", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private List<Timeslot> timeslots;
//}


// ====================================== Location and Description Added ===========================================================


package com.badMinz.court_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "courts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // --- ADD THESE TWO FIELDS ---
    @Column(name = "location") // Matches the column you added via SQL
    private String location;

    @Column(name = "description") // Matches the column you added via SQL
    private String description;
    // ----------------------------

    @Enumerated(EnumType.STRING)
    private SurfaceType surfaceType;

    @Column(nullable = false)
    private BigDecimal pricePerHour;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "court", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Timeslot> timeslots;
}