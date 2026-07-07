package com.nov.eventify.dto;

import com.nov.eventify.entity.enums.RegistrationStatus;
import jakarta.validation.constraints.NotNull;

public record RegistrationStatusUpdateRequest(
        @NotNull(message = "Status is required")
        RegistrationStatus status
) {
}
