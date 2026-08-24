package com.concord.application.domain.dto.message;
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
public class SendMessageRequest {

    @NotBlank(message="Target is required")
    private String target;

    @NotNull(message="Type is required")
    private FromType type;

    @NotBlank(message="Content is required")
    private String content;

    public MessageEntity toEntity() {
        return MessageEntity.builder()
                .receiver(this.target)
                .type(this.type)
                .content(this.content)
                .build();
    }
}