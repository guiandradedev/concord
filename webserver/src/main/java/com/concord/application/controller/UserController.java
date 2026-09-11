package com.concord.application.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.concord.application.domain.dto.UserDTO;
import com.concord.application.domain.dto.UserSearchResultDTO;
import com.concord.application.domain.model.UserEntity;
import com.concord.application.exception.NotFoundException;
import com.concord.application.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(@AuthenticationPrincipal UserEntity currentUser){

        UserDTO dto = UserDTO.builder()
                .id(currentUser.getId())
                .name(currentUser.getName())
                .email(currentUser.getName())
                .build();

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResultDTO>> searchUsers(
            @RequestParam(defaultValue = "") String name,
            @AuthenticationPrincipal UserEntity currentUser
    ) {
        return ResponseEntity.ok(userService.searchByName(name, currentUser));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserSearchResultDTO> getUser(
            @PathVariable UUID userId
    ) throws NotFoundException {
        return ResponseEntity.ok(userService.getPublicUser(userId));
    }
}
