package com.concord.application.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.concord.application.domain.model.UserEntity;

class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "test-secret-key-123456");
    }

    @Test
    void shouldGenerateAndValidateAccessToken() {
        UserEntity user = UserEntity.builder().email("user@concord.com").build();

        String token = tokenService.generateAccessToken(user);
        String subject = tokenService.validateToken(token);

        assertThat(token).isNotBlank();
        assertThat(subject).isEqualTo("user@concord.com");
    }

    @Test
    void shouldGenerateAndValidateRefreshToken() {
        UserEntity user = UserEntity.builder().email("user@concord.com").build();

        String refreshToken = tokenService.generateRefreshToken(user);
        String subject = tokenService.validateToken(refreshToken);

        assertThat(refreshToken).isNotBlank();
        assertThat(subject).isEqualTo("user@concord.com");
    }

    @Test
    void shouldReturnEmptyStringForInvalidToken() {
        assertThat(tokenService.validateToken("token.invalido.aqui")).isEmpty();
    }
}