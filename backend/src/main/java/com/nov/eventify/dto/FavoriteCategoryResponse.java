package com.nov.eventify.dto;

import com.nov.eventify.entity.enums.EventCategory;

public record FavoriteCategoryResponse(
        EventCategory category,
        long count
) {
}
