package com.concord.application.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.concord.application.database.repository.IMessageRepository;
import com.concord.application.database.repository.IUserRepository;
import com.concord.application.domain.dto.PublishMessageDTO;
import com.concord.application.domain.dto.UserDTO;
import com.concord.application.domain.dto.message.FromType;
import com.concord.application.domain.dto.message.SendMessageDTO;
import com.concord.application.domain.model.MessageEntity;
import com.concord.application.domain.model.UserEntity;
import com.concord.application.domain.ports.out.MessagePublisher;
import com.concord.application.exception.PublishException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessagePublisher messagePublisher;
    private final IMessageRepository messageRepository;
    private final UserService userService;
    private final IUserRepository userRepository;

    private final String privateMessageTopic = "my-topic";

    public List<UserDTO> getRecentChats(UserEntity user) {
        String userId = user.getId().toString();

        List<MessageEntity> messages = messageRepository.findBySenderOrReceiver(userId, userId);

        Set<UUID> friendIds = messages.stream()
                .map(msg -> msg.getSender().equals(userId) ? msg.getReceiver() : msg.getSender())
                .map(UUID::fromString)
                .collect(Collectors.toSet());

        List<UserEntity> recentUsers = userRepository.findAllById(friendIds);

        return recentUsers.stream()
                .map(u -> UserDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .build())
                .toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public void sendMessage(SendMessageDTO contentDTO) throws PublishException {
        // Valida os dados do DTO
        // - Usuário de origem existe
        // - Se type == FromType.USER, valida se o destino existe
        // - Se type == FromType.CHANNEL, valida se o canal existe e se o usuario tem
        // permissao de falar nesse chat

        if (contentDTO.getTarget().equals(contentDTO.getSender())) {
            throw new IllegalArgumentException("Sender and receiver cannot be the same");
        }

        if (contentDTO.getType() == FromType.USER) {
            try {
                userService.findById(UUID.fromString(contentDTO.getTarget()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Receiver not found");
            }
        }

        MessageEntity savedMessage = messageRepository.saveAndFlush(contentDTO.toEntity());

        UUID transactionId = UUID.randomUUID();

        MessagePublisher.Message<MessageEntity> message = new MessagePublisher.Message<>(
                transactionId,
                this.privateMessageTopic,
                contentDTO.getTarget(),
                savedMessage,
                Map.of(),
                Instant.now(),
                null);

        messagePublisher.publish(message);
    }

    public List<MessageEntity> getMessagesFromUser(String fromUserId, String toUserId) {
        List<MessageEntity> messages = messageRepository.findConversation(fromUserId, toUserId, FromType.USER);

        return messages;
    }

    public List<MessageEntity> getRecentMessages(UUID userId) {
        // TODO: implement this
        // return messageRepository.findRecentMessages(userId);
        return List.of();
    }

    public List<MessageEntity> getMessagesFromChannel(String channelId) {
        // TODO: implement this
        // return messageRepository.findByChannelId(channelId);
        return List.of();
    }
}
