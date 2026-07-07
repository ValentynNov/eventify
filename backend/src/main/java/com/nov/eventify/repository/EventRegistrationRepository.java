package com.nov.eventify.repository;

import com.nov.eventify.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID>,
        JpaSpecificationExecutor<EventRegistration> {

}
