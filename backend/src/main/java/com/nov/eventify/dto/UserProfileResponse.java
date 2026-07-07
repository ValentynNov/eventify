package com.nov.eventify.dto;

import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String username,
        String email,
        String role,
        String avatarEmoji,
        long totalRegistrationCount,
        long approvedRegistrationCount,
        long pendingRegistrationCount,
        long rejectedRegistrationCount,
        int streakDays,
        List<FavoriteCategoryResponse> favoriteCategories,
        List<RegistrationResponse> recentRegistrations,
        List<AchievementResponse> achievements
) {
}
