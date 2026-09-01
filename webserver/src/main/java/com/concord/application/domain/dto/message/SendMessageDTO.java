package com.concord.application.domain.dto.message;
import java.util.UUID;

import com.concord.application.domain.model.MessageEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class SendMessageDTO {
    private UUID id;

    @NotNull(message="From is required")
    private String sender;

    @NotNull(message="Target is required")
    private String target;

    @NotNull(message="Type is required")
    private FromType type;

    @NotBlank(message="Content is required")
    private String content;

    public static SendMessageDTO fromRequest(SendMessageRequest request, UUID sender) {
        return SendMessageDTO.builder()
                .sender(sender.toString())
                .target(request.getTarget())
                .type(request.getType())
                .content(request.getContent())
                .build();
    }
}