package com.nov.eventify.security;

public record FirebasePrincipal(
        String uid,
        String email
) {
}
