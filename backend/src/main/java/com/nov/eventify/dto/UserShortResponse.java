package com.nov.eventify.dto;

import java.util.UUID;

public record UserShortResponse(
        UUID id,
        String username,
        String email,
        String role,
        String avatarEmoji
) {
}
