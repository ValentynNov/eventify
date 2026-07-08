package com.nov.eventify.service;

import com.nov.eventify.dto.CurrentUserResponse;
import com.nov.eventify.dto.SyncUserRequest;
import com.nov.eventify.entity.User;
import com.nov.eventify.entity.enums.UserRole;
import com.nov.eventify.repository.UserRepository;
import com.nov.eventify.security.FirebasePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthSyncService {

    private final UserRepository userRepository;

    public CurrentUserResponse sync(
            FirebasePrincipal principal, SyncUserRequest request
    ) {
        User user = userRepository.findByFirebaseUid(principal.uid())
                .orElseGet(() -> createUser(principal, request));

        return toResponse(user);
    }

    public CurrentUserResponse me(FirebasePrincipal principal) {
        User user = userRepository.findByFirebaseUid(principal.uid())
                .orElseThrow(() -> new RuntimeException("user is not synced"));

        return toResponse(user);
    }

    private User createUser(FirebasePrincipal principal, SyncUserRequest request) {
        String username = request.username().trim();

        if (userRepository.existsByEmailIgnoreCase(principal.email())) {
            throw new RuntimeException("email already exists");
        }

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new RuntimeException("username already exists");
        }

        User user = new User();

        user.setFirebaseUid(principal.uid());
        user.setEmail(principal.email().trim().toLowerCase());
        user.setUsername(username);
        user.setRole(resolveRole(principal.email()));

        return userRepository.save(user);
    }

    private UserRole resolveRole(String email) {
        if (email != null && email.endsWith("@admin.eventify")) {
            return UserRole.ADMIN;
        }
        return UserRole.USER;
    }


    private CurrentUserResponse toResponse(User user) {
        return new CurrentUserResponse(
                user.getId(),
                user.getFirebaseUid(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
