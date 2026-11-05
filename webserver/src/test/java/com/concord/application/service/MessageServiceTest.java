package com.concord.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.concord.application.database.repository.IMessageRepository;
import com.concord.application.database.repository.IUserRepository;
import com.concord.application.domain.dto.UserDTO;
import com.concord.application.domain.dto.message.FromType;
import com.concord.application.domain.dto.message.MessageResponse;
import com.concord.application.domain.dto.message.SendMessageRequest;
import com.concord.application.domain.model.MessageEntity;
import com.concord.application.domain.model.UserEntity;
import com.concord.application.domain.ports.out.MessagePublisher;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessagePublisher messagePublisher;

    @Mock
    private IMessageRepository messageRepository;

    @Mock
    private IUserRepository userRepository;

    @InjectMocks
    private MessageService messageService;

    @Test
    void shouldSaveAndPublishMessageWhenReceiverExists() throws Exception {
        UUID senderId = UUID.randomUUID();
        UUID receiverId = UUID.randomUUID();
        UUID messageId = UUID.randomUUID();

        UserEntity sender = UserEntity.builder().id(senderId).name("Alice").build();
        UserEntity receiver = UserEntity.builder().id(receiverId).name("Bob").build();

        SendMessageRequest request = SendMessageRequest.builder()
                .target(receiverId.toString())
                .type(FromType.USER)
                .content("Oi, tudo bem?")
                .build();

        MessageEntity savedEntity = MessageEntity.builder()
                .id(messageId)
                .sender(sender)
                .receiver(receiver)
                .type(FromType.USER)
                .content("Oi, tudo bem?")
                .createdAt(Instant.parse("2026-09-09T12:00:00Z"))
                .build();

        when(userRepository.findById(receiverId)).thenReturn(Optional.of(receiver));
        when(messageRepository.saveAndFlush(any(MessageEntity.class))).thenReturn(savedEntity);

        messageService.sendMessage(request, sender);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<MessagePublisher.Message<MessageResponse>> captor =
                ArgumentCaptor.forClass(MessagePublisher.Message.class);

        verify(messagePublisher).publish(captor.capture());

        MessagePublisher.Message<MessageResponse> published = captor.getValue();
        assertThat(published.topic()).isEqualTo("my-topic");
        assertThat(published.key()).isEqualTo(receiverId.toString());
        assertThat(published.payload().getId()).isEqualTo(messageId.toString());
        assertThat(published.payload().getSender()).isEqualTo(senderId.toString());
        assertThat(published.payload().getReceiver()).isEqualTo(receiverId.toString());
        assertThat(published.payload().getContent()).isEqualTo("Oi, tudo bem?");
    }

    @Test
    void shouldThrowExceptionWhenReceiverDoesNotExist() throws Exception {
        UUID senderId = UUID.randomUUID();
        UUID unknownReceiverId = UUID.randomUUID();

        UserEntity sender = UserEntity.builder().id(senderId).build();
        SendMessageRequest request = SendMessageRequest.builder()
                .target(unknownReceiverId.toString())
                .type(FromType.USER)
                .content("Oi")
                .build();

        when(userRepository.findById(unknownReceiverId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> messageService.sendMessage(request, sender))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Destinatário não encontrado");

        verify(messageRepository, never()).saveAndFlush(any());
        verify(messagePublisher, never()).publish(any());
    }

    @Test
    void shouldReturnRecentChatsPreservingOrderWithoutDuplicates() {
        UserEntity currentUser = UserEntity.builder().id(UUID.randomUUID()).name("Eu").email("eu@email.com").build();
        UserEntity friend1 = UserEntity.builder().id(UUID.randomUUID()).name("Amigo 1").email("a1@email.com").build();
        UserEntity friend2 = UserEntity.builder().id(UUID.randomUUID()).name("Amigo 2").email("a2@email.com").build();

        List<MessageEntity> messages = List.of(
                MessageEntity.builder().sender(currentUser).receiver(friend1).build(),
                MessageEntity.builder().sender(friend1).receiver(currentUser).build(),
                MessageEntity.builder().sender(friend2).receiver(currentUser).build()
        );

        when(messageRepository.findBySenderOrReceiver(currentUser.getId())).thenReturn(messages);

        List<UserDTO> recentChats = messageService.getRecentChats(currentUser);

        assertThat(recentChats).hasSize(2);
        assertThat(recentChats.get(0).getId()).isEqualTo(friend1.getId());
        assertThat(recentChats.get(1).getId()).isEqualTo(friend2.getId());
    }

    @Test
    void shouldReturnConversationHistoryBetweenTwoUsers() {
        UUID userA = UUID.randomUUID();
        UUID userB = UUID.randomUUID();

        MessageEntity msg = MessageEntity.builder()
                .id(UUID.randomUUID())
                .sender(UserEntity.builder().id(userA).build())
                .receiver(UserEntity.builder().id(userB).build())
                .type(FromType.USER)
                .content("Olá")
                .createdAt(Instant.parse("2026-09-09T12:00:00Z"))
                .build();

        when(messageRepository.findConversation(userA, userB, FromType.USER)).thenReturn(List.of(msg));

        List<MessageResponse> history = messageService.getMessagesFromUser(userA.toString(), userB.toString());

        assertThat(history).hasSize(1);
        assertThat(history.get(0).getContent()).isEqualTo("Olá");
        assertThat(history.get(0).getSender()).isEqualTo(userA.toString());
        assertThat(history.get(0).getReceiver()).isEqualTo(userB.toString());
    }
}