package com.concord.application.domain.dto.auth;

public record TokenResponseDTO(
        String accessToken,
        String refreshToken
) {}