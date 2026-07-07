package com.nov.eventify.repository;

import com.nov.eventify.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    Optional<RefreshToken> findByTokenHashAndRevokedAtIsNull(String tokenHash);

    List<RefreshToken> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);

    boolean existsByTokenHashAndRevokedAtIsNull(String tokenHash);

}
