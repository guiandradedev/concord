package com.concord.application.domain.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class UserDTO {
    private UUID id;
    private String name;
    private String email;
    private String username;
}
