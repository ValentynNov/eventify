package com.nov.eventify.service;

import com.nov.eventify.entity.EventRegistration;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RegistrationStreakService {

    public int calculateStreakDays(List<EventRegistration> registrations) {
        Set<LocalDate> registrationDays = registrations.stream()
                .map(EventRegistration::getCreatedAt)
                .map(LocalDateTime::toLocalDate)
                .collect(Collectors.toSet());

        return calculateStreakDays(registrationDays);
    }

    public int calculateStreakDays(Set<LocalDate> registrationDays) {
        LocalDate today = LocalDate.now();

        LocalDate currentDay;

        if (registrationDays.contains(today)) {
            currentDay = today;
        } else if (registrationDays.contains(today.minusDays(1))) {
            currentDay = today.minusDays(1);
        } else {
            return 0;
        }

        int days = 0;

        while (registrationDays.contains(currentDay)) {
            days++;
            currentDay = currentDay.minusDays(1);
        }

        return days;
    }
}
