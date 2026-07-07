package com.nov.eventify.dto;

import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.EventFormat;

import java.time.LocalDateTime;
import java.util.UUID;

public record EventShortResponse(
        UUID id,
        String title,
        EventCategory category,
        EventFormat format,
        String location,
        LocalDateTime eventDate
) {
}
