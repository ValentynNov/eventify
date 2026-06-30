package com.nov.eventify.model;

import com.nov.eventify.model.enums.EventCategory;
import com.nov.eventify.model.enums.EventFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "event")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private EventCategory category;

    @Column(name = "format")
    @Enumerated(EnumType.STRING)
    private EventFormat format;

    @Column(name = "location")
    private String location;

    @Column(name = "capacity")
    private long capacity;

    @UpdateTimestamp
    @Column(name = "event_date")
    private LocalDateTime eventDate;

    @OneToMany(mappedBy = "event")
    private List<EventRegistration> registrations = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;



}
