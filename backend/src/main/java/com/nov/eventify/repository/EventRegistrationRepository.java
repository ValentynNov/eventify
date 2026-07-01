package com.nov.eventify.repository;

import com.nov.eventify.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
}
