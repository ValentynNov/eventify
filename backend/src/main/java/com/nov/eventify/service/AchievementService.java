package com.nov.eventify.service;

import com.nov.eventify.dto.AchievementResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    public List<AchievementResponse> calculateAchievements(
            long totalRegistrationCount,
            long approvedRegistrationCount,
            long distinctEventCount,
            long distinctCategoryCount,
            int streakDays
    ) {
        return List.of(
                new AchievementResponse(
                        "Перший крок",
                        "Подати першу заявку.",
                        totalRegistrationCount >= 1
                ),
                new AchievementResponse(
                        "Учасник ком’юніті",
                        "Отримати першу схвалену заявку.",
                        approvedRegistrationCount >= 1
                ),
                new AchievementResponse(
                        "Гаряча серія",
                        "Реєструватися 3 дні поспіль.",
                        streakDays >= 3
                ),
                new AchievementResponse(
                        "Постійний гість",
                        "Отримати 3 схвалені заявки.",
                        approvedRegistrationCount >= 3
                ),
                new AchievementResponse(
                        "Колекціонер подій",
                        "Подати заявки на 5 різних подій.",
                        distinctEventCount >= 5
                ),
                new AchievementResponse(
                        "Дослідник форматів",
                        "Подати заявки мінімум у 3 різних категоріях.",
                        distinctCategoryCount >= 3
                )
        );
    }
}