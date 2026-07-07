package com.nov.eventify.dto;

public record AchievementResponse(
        String code,
        String title,
        String description,
        boolean unlocked
) {
}
