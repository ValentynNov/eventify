package com.nov.eventify.entity;

import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.EventFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private EventCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "format", nullable = false, length = 30)
    private EventFormat format;

    @Column(name = "location", nullable = false, length = 300)
    private String location;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventRegistration> registrations = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}