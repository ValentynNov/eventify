package com.nov.eventify.controller;

import com.nov.eventify.dto.CurrentUserResponse;
import com.nov.eventify.dto.SyncUserRequest;
import com.nov.eventify.security.FirebasePrincipal;
import com.nov.eventify.service.AuthSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthSyncService authSyncService;

    @PostMapping("/sync")
    public CurrentUserResponse sync(
            @AuthenticationPrincipal FirebasePrincipal principal
            , @RequestBody SyncUserRequest request
    ) {
        return authSyncService.sync(principal, request);
    }

    @GetMapping("/me")
    public CurrentUserResponse me(
            @AuthenticationPrincipal FirebasePrincipal principal
    ) {
        return authSyncService.me(principal);
    }
}
