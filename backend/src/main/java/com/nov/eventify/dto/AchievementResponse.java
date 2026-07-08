package com.nov.eventify.dto;

public record AchievementResponse(
        String title,
        String description,
        boolean unlocked
) {
}
