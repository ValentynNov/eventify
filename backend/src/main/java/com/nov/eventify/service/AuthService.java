package com.nov.eventify.service;

import com.nov.eventify.dto.AuthResponse;
import com.nov.eventify.dto.LoginRequest;
import com.nov.eventify.dto.RegisterRequest;
import com.nov.eventify.entity.User;
import com.nov.eventify.entity.enums.UserRole;
import com.nov.eventify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new RuntimeException("email already exists"); //TODO: custom exception
        }

        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            throw new RuntimeException("username already exists");
        }

        User user = new User();
        user.setUsername((request.username()).trim());
        user.setEmail((request.email()).trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.USER);

        User savedUser = userRepository.save(user);

        return toAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email()).
                orElseThrow(() -> new RuntimeException("invalid credentials"));

        if(!passwordEncoder.matches(request.password(), user.getPasswordHash())){
            throw new RuntimeException("invalid credentials");
        }

        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
                "access-token-here",
                "refresh-token-here",
                LocalDateTime.now().plusMinutes(120),
                LocalDateTime.now().plusDays(14),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
