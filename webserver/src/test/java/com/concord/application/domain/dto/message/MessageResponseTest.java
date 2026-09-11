package com.concord.application.domain.dto.message;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.concord.application.domain.model.MessageEntity;
import com.concord.application.domain.model.UserEntity;

class MessageResponseTest {

    @Test
    void shouldExposeUserIdsInsteadOfUserEntities() {
        UUID senderId = UUID.randomUUID();
        UUID receiverId = UUID.randomUUID();
        Instant createdAt = Instant.parse("2026-09-09T12:00:00Z");
        MessageEntity message = MessageEntity.builder()
                .id(UUID.randomUUID())
                .sender(UserEntity.builder().id(senderId).build())
                .receiver(UserEntity.builder().id(receiverId).build())
                .type(FromType.USER)
                .content("Olá")
                .createdAt(createdAt)
                .build();

        MessageResponse response = MessageResponse.fromEntity(message);

        assertThat(response.getSender()).isEqualTo(senderId.toString());
        assertThat(response.getReceiver()).isEqualTo(receiverId.toString());
        assertThat(response.getContent()).isEqualTo("Olá");
        assertThat(response.getCreatedAt()).isEqualTo(createdAt.toString());
    }
}
