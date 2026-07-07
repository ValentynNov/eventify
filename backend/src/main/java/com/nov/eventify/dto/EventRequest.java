package com.nov.eventify.dto;

import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.EventFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record EventRequest(
        @NotBlank(message = "Title is required")
        @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(min = 4, max = 8000, message = "Description must be between 4 and 8000 characters")
        String description,

        @NotNull(message = "Category is required")
        EventCategory category,

        @NotNull(message = "Format is required")
        EventFormat format,

        @NotBlank(message = "Location is required")
        @Size(min = 2, max = 300, message = "Location must be between 2 and 300 characters")
        String location,

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        @Max(value = 100000, message = "Capacity must be at most 100000")
        Integer capacity,

        @NotNull(message = "Event date is required")
        @Future(message = "Event date must be in the future")
        LocalDateTime eventDate
) {
}
