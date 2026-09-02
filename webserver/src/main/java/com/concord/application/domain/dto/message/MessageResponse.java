package com.concord.application.domain.dto.message;

import com.concord.application.domain.model.MessageEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class MessageResponse {
    private String id;
    private String sender;
    private String receiver;
    private FromType type;
    private String content;

    public static MessageResponse fromEntity(MessageEntity entity) {
        return MessageResponse.builder()
                .id(entity.getId().toString())
                .sender(entity.getSender().getId().toString()) // Id remetente
                .receiver(entity.getReceiver().getId().toString()) // Id destinatario
                .type(entity.getType())
                .content(entity.getContent())
                .build();
    }

}
