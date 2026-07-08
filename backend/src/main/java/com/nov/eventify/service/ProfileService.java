package com.nov.eventify.service;

import com.nov.eventify.dto.*;
import com.nov.eventify.entity.Event;
import com.nov.eventify.entity.EventRegistration;
import com.nov.eventify.entity.User;
import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.RegistrationStatus;
import com.nov.eventify.repository.EventRegistrationRepository;
import com.nov.eventify.repository.UserRepository;
import com.nov.eventify.security.FirebasePrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.nov.eventify.entity.enums.RegistrationStatus.*;


@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final EventRegistrationRepository registrationRepository;
    private final AchievementService achievementService;
    private final RegistrationStreakService streakService;

    public UserProfileResponse getMyProfile(FirebasePrincipal principal) {
        User user = userRepository.findByFirebaseUid(principal.uid())
                .orElseThrow(() -> new RuntimeException("user is not synced"));

        List<EventRegistration> registrations =
                registrationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        long total = registrations.size();

        long approved = countByStatus(registrations, APPROVED);
        long pending = countByStatus(registrations, PENDING);
        long rejected = countByStatus(registrations, REJECTED);

        int streakDays = streakService.calculateStreakDays(registrations);

        List<FavoriteCategoryResponse> favoriteCategories =
                calculateFavoriteCategories(registrations);

        long distinctEventCount = registrations.stream()
                .map(registration -> registration.getEvent().getId())
                .distinct()
                .count();

        long distinctCategoryCount = registrations.stream()
                .map(registration -> registration.getEvent().getCategory())
                .distinct()
                .count();

        List<RegistrationResponse> recentRegistrations = registrations.stream()
                .limit(5)
                .map(this::toRegistrationResponse)
                .toList();


        List<AchievementResponse> achievements =
                achievementService.calculateAchievements(
                        total,
                        approved,
                        distinctEventCount,
                        distinctCategoryCount,
                        streakDays
                );

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getAvatarEmoji(),
                total,
                approved,
                pending,
                rejected,
                streakDays,
                favoriteCategories,
                recentRegistrations,
                achievements
        );


    }

    public AvatarResponse updateMyAvatar(FirebasePrincipal principal,
                                         UpdateAvatarRequest request) {

        User user = userRepository.findByFirebaseUid(principal.uid())
                .orElseThrow(() -> new RuntimeException("user is not synced"));

        if (user.getAvatarEmoji() != null && !user.getAvatarEmoji().isBlank()) {
            throw new RuntimeException("avatar emoji already selected");
        }

        String avatarEmoji = request.avatarEmoji().trim();
        user.setAvatarEmoji(avatarEmoji);
        User savedUser = userRepository.save(user);

        return new AvatarResponse(savedUser.getAvatarEmoji());
    }


    private RegistrationResponse toRegistrationResponse(EventRegistration registration) {
        Event event = registration.getEvent();

        return new RegistrationResponse(
                registration.getId(),
                registration.getStatus(),
                registration.getCreatedAt(),
                new EventShortResponse(
                        event.getId(),
                        event.getTitle(),
                        event.getCategory(),
                        event.getFormat(),
                        event.getLocation(),
                        event.getEventDate()
                ));
    }

    private List<FavoriteCategoryResponse> calculateFavoriteCategories
            (List<EventRegistration> registrations) {

        return registrations.stream()
                .collect(Collectors.groupingBy(
                        registration -> registration.getEvent().getCategory(),
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<EventCategory, Long>comparingByValue().reversed())
                .map(entry -> new FavoriteCategoryResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();

    }

    private long countByStatus(List<EventRegistration> registrations,
                               RegistrationStatus status) {

        return registrations.stream()
                .filter(registration -> registration.getStatus() == status)
                .count();
    }


}
