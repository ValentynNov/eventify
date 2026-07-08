package com.nov.eventify.dto;

import com.nov.eventify.entity.enums.RegistrationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record RegistrationResponse(
        UUID id,
        RegistrationStatus status,
        LocalDateTime createdAt,
        EventShortResponse event
) {
}
