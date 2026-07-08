package com.nov.eventify.repository;

import com.nov.eventify.entity.EventRegistration;
import com.nov.eventify.entity.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID>,
        JpaSpecificationExecutor<EventRegistration> {

    boolean existsByUserAndEventId(UUID userId, UUID eventId);

    long countByEventIdAndStatus(UUID eventId, RegistrationStatus status);

    List<EventRegistration> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("""
            select r.createdAt 
            from EventRegistration r 
            where r.user.id = :userId
            """)
    List<LocalDateTime> findCreatedAtByUserId(UUID uuid);
}
