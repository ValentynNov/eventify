package com.nov.eventify.dto;

import java.time.LocalDateTime;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        LocalDateTime expiresAt,
        LocalDateTime refreshTokenExpiresAt,
        String username,
        String email,
        String role
) {
}
