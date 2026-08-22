package com.concord.application.domain.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenDTO(
        @NotBlank(message = "O refresh token é obrigatório") String refreshToken
) {}