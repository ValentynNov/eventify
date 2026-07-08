package com.nov.eventify.service;

import com.nov.eventify.dto.*;
import com.nov.eventify.entity.Event;
import com.nov.eventify.entity.EventRegistration;
import com.nov.eventify.entity.User;
import com.nov.eventify.entity.enums.RegistrationStatus;
import com.nov.eventify.repository.EventRegistrationRepository;
import com.nov.eventify.repository.EventRepository;
import com.nov.eventify.repository.UserRepository;
import com.nov.eventify.security.FirebasePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final RegistrationStreakService streakService;

    public RegistrationResponse createRegistration(UUID eventId, FirebasePrincipal principal) {
        User user = getUser(principal);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("event not found"));


        if (registrationRepository.existsByUserAndEventId(user.getId(), event.getId())) {
            throw new RuntimeException("registration already exists");
        }

        long approvedCount = registrationRepository.countByEventIdAndStatus(
                event.getId(),
                RegistrationStatus.APPROVED
        );

        if (approvedCount >= event.getCapacity()) {
            throw new RuntimeException("event is full");
        }

        EventRegistration eventRegistration = new EventRegistration();
        eventRegistration.setUser(user);
        eventRegistration.setEvent(event);
        eventRegistration.setStatus(RegistrationStatus.PENDING);

        return toResponse(registrationRepository.save(eventRegistration));
    }

    private RegistrationResponse toResponse(EventRegistration registration) {
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
                )
        );
    }


    public PagedResponse<AdminRegistrationResponse> getRegistrations
            (RegistrationStatus status,
             UUID eventId, String search,
             int page, int pageSize) {
        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                Sort.by("createdAt").descending()
        );

        Specification<EventRegistration> spec = Specification.<EventRegistration>unrestricted();
        spec = andIfPresent(spec, statusSpec(status));
        spec = andIfPresent(spec, eventIdSpec(eventId));
        spec = andIfPresent(spec, searchSpec(search));

        Page<EventRegistration> registrations = registrationRepository.findAll(spec, pageable);

        return new PagedResponse<>(
                registrations.getContent().stream()
                        .map(this::toAdminResponse)
                        .toList(),
                registrations.getNumber(),
                registrations.getSize(),
                registrations.getTotalElements(),
                registrations.getTotalPages(),
                registrations.hasNext(),
                registrations.hasPrevious()
        );
    }

    public AdminRegistrationResponse updateRegistrationStatus(UUID eventId,
                                                              RegistrationStatusUpdateRequest request) {

        EventRegistration registration = registrationRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("registration not found"));

        RegistrationStatus newStatus = request.status();

        if (newStatus == RegistrationStatus.APPROVED
                && registration.getStatus() != RegistrationStatus.APPROVED) {
            long approvedCount = registrationRepository.countByEventIdAndStatus(
                    registration.getEvent().getId(),
                    RegistrationStatus.APPROVED
            );

            if (approvedCount >= registration.getEvent().getCapacity()) {
                throw new RuntimeException("event capacity is full");
            }
        }

        registration.setStatus(newStatus);

        return toAdminResponse(registrationRepository.save(registration));
    }

    public List<RegistrationResponse> getMyRegistrations(FirebasePrincipal principal) {
        User user = getUser(principal);

        return registrationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RegistrationStreakResponse getMyStreak(FirebasePrincipal principal) {
        User user = getUser(principal);

        List<EventRegistration> registrations =
                registrationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        int days = streakService.calculateStreakDays(registrations);

        return new RegistrationStreakResponse(days);
    }


    private User getUser(FirebasePrincipal principal) {
        return userRepository.findByFirebaseUid(principal.uid())
                .orElseThrow(() -> new RuntimeException("user not found"));
    }

    private AdminRegistrationResponse toAdminResponse(EventRegistration registration) {

        User user = registration.getUser();
        Event event = registration.getEvent();

        return new AdminRegistrationResponse(
                registration.getId(),
                registration.getStatus(),
                registration.getCreatedAt(),
                registration.getUpdatedAt(),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                event.getId(),
                event.getTitle(),
                event.getCategory(),
                event.getFormat(),
                event.getLocation(),
                event.getCapacity(),
                event.getEventDate()
        );
    }

    private Specification<EventRegistration> statusSpec(RegistrationStatus status) {
        if (status == null) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    private Specification<EventRegistration> eventIdSpec(UUID eventId) {
        if (eventId == null) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("event").get("id"), eventId);
    }

    private Specification<EventRegistration> searchSpec(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }

        String pattern = "%" + search.trim().toLowerCase() + "%";

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("username")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("event").get("title")), pattern)
                );
    }

    private Specification<EventRegistration> andIfPresent(
            Specification<EventRegistration> base,
            Specification<EventRegistration> next
    ) {
        return next == null ? base : base.and(next);
    }
}
