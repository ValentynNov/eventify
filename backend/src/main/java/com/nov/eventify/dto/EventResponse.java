package com.nov.eventify.dto;

import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.EventFormat;

import java.time.LocalDateTime;
import java.util.UUID;

public record EventResponse(
        UUID id,
        String title,
        String description,
        EventCategory category,
        EventFormat format,
        String location,
        Integer capacity,
        LocalDateTime eventDate,
        LocalDateTime createdAt,
        Long approvedRegistrationCount) {
}
