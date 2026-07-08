package com.nov.eventify.dto;

import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.EventFormat;
import com.nov.eventify.entity.enums.RegistrationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminRegistrationResponse(
        UUID id,
        RegistrationStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        UUID userId,
        String username,
        String email,

        UUID eventId,
        String eventTitle,
        EventCategory category,
        EventFormat format,
        String location,
        Integer capacity,
        LocalDateTime eventDate
) {
}
