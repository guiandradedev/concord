package com.concord.application.dto.message;
import com.concord.application.domain.model.MessageEntity;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message="From is required")
    private String from;

    @NotBlank(message="Target is required")
    private String target;

    @NotBlank(message="Type is required")
    private FromType type;

    @NotBlank(message="Content is required")
    private String content;

    public MessageEntity toEntity() {
        return MessageEntity.builder()
                .sender(this.from)
                .receiver(this.target)
                .type(this.type)
                .content(this.content)
                .build();
    }
}