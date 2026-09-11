package com.concord.application.domain.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class PublishMessageDTO<T> {

    private UUID id;

    @NotBlank(message = "Destination is required")
    private String destination;

    private String key;

    private T payload;

    private Map<String, String> headers;

    private Instant timestamp;

    private String correlationId;
}