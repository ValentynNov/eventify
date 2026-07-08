package com.nov.eventify.dto;

import java.util.UUID;

public record CurrentUserResponse(
        UUID id,
        String firebaseUid,
        String username,
        String email,
        String role
) {
}
