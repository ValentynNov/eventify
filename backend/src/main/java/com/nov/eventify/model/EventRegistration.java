package com.nov.eventify.model;


import com.nov.eventify.model.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_registration")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id",
            referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id",
            referencedColumnName = "id")
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RegistrationStatus status;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
