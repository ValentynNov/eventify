package com.nov.eventify.controller;


import com.nov.eventify.dto.*;
import com.nov.eventify.entity.enums.RegistrationStatus;
import com.nov.eventify.security.FirebasePrincipal;
import com.nov.eventify.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;


    @PostMapping("/events/{eventId}")
    public RegistrationResponse createRegistration(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal FirebasePrincipal principal
    ) {
        return registrationService.createRegistration(eventId, principal);
    }

    @GetMapping("/me")
    public List<RegistrationResponse> getMyRegistrations(
            @AuthenticationPrincipal FirebasePrincipal principal
    ) {
        return registrationService.getMyRegistrations(principal);
    }

    @GetMapping
    public PagedResponse<AdminRegistrationResponse> getRegistrations(
            @RequestParam(required = false) RegistrationStatus status,
            @RequestParam(required = false) UUID eventId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int pageSize) {
        return registrationService.getRegistrations(status, eventId, search, page, pageSize);
    }

    @PatchMapping("/{registrationId}/status")
    public AdminRegistrationResponse updateRegistrationStatus(
            @PathVariable UUID registrationId,
            @Valid @RequestBody RegistrationStatusUpdateRequest request
    ) {
        return registrationService.updateRegistrationStatus(registrationId, request);
    }

    @GetMapping("/me/streak")
    public RegistrationStreakResponse getMyStreak(
            @AuthenticationPrincipal FirebasePrincipal principal
    ){
        return registrationService.getMyStreak(principal);
    }
}
