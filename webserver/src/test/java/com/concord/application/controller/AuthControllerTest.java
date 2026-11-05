package com.concord.application.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.concord.application.database.repository.IUserRepository;
import com.concord.application.domain.dto.auth.AuthenticationDTO;
import com.concord.application.domain.dto.auth.RegisterDTO;
import com.concord.application.domain.dto.auth.TokenResponseDTO;
import com.concord.application.domain.model.UserEntity;
import com.concord.application.exception.AlreadyExistsException;
import com.concord.application.service.TokenService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenService tokenService;

    @Mock
    private IUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    @Test
    void shouldReturnAccessTokenAndSetRefreshCookieOnLogin() {
        UserEntity user = UserEntity.builder().email("user@example.com").build();
        AuthenticationDTO loginDto = new AuthenticationDTO("user@example.com", "123456");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(user, null));
        when(tokenService.generateAccessToken(user)).thenReturn("access-123");
        when(tokenService.generateRefreshToken(user)).thenReturn("refresh-123");

        ResponseEntity<TokenResponseDTO> response = authController.login(loginDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().accessToken()).isEqualTo("access-123");
        assertThat(response.getHeaders().getFirst(HttpHeaders.SET_COOKIE))
                .contains("refreshToken=refresh-123")
                .contains("HttpOnly");
    }

    @Test
    void shouldThrowAlreadyExistsExceptionWhenRegisteringDuplicateEmail() {
        RegisterDTO registerDto = new RegisterDTO("Maria", "maria@example.com", "123456");
        when(userRepository.findByEmail("maria@example.com")).thenReturn(new UserEntity());

        assertThatThrownBy(() -> authController.register(registerDto))
                .isInstanceOf(AlreadyExistsException.class)
                .hasMessage("Este email já está em uso.");
    }

    @Test
    void shouldReturnUnauthorizedWhenRefreshTokenIsBlank() {
        ResponseEntity<TokenResponseDTO> response = authController.refresh("");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void shouldClearCookieOnLogout() {
        ResponseEntity<Void> response = authController.logout();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getFirst(HttpHeaders.SET_COOKIE)).contains("Max-Age=0");
    }
}