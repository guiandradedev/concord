package com.concord.application.controller;

import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties.Apiversion.Use;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.concord.application.domain.dto.UserDTO;
import com.concord.application.domain.model.UserEntity;

@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(@AuthenticationPrincipal UserEntity currentUser){

        UserDTO dto = UserDTO.builder()
                .id(currentUser.getId())
                .name(currentUser.getName())
                .email(currentUser.getName())
                .build();

        return ResponseEntity.ok(dto);
    }
}
