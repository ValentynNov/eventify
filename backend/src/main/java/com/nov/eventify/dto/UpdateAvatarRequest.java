package com.nov.eventify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateAvatarRequest(
        @NotBlank(message = "Avatar emoji is required")
        @Size(max = 16, message = "Avatar emoji must be at most 16 characters")
        String avatarEmoji
) {
}
