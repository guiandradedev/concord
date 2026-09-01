package com.concord.application.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import java.util.LinkedHashSet;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.concord.application.database.repository.IMessageRepository;
import com.concord.application.database.repository.IUserRepository;
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
    private final IUserRepository userRepository; 
    private final String privateMessageTopic = "my-topic";

    public List<UserDTO> getRecentChats(UserEntity currentUser){
        
        List<MessageEntity> messages = messageRepository.findBySenderOrReceiver(currentUser.getId());

        Set<UserEntity> recentUsers = messages.stream()
                .map(msg -> msg.getSender().getId().equals(currentUser.getId()) ? msg.getReceiver() : msg.getSender())
                .collect(Collectors.toCollection(LinkedHashSet::new));

        return recentUsers.stream()
                .map(u -> UserDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .build())
                .toList();
    }

    @Transactional
    public void sendMessage(SendMessageDTO contentDTO, UserEntity sender) throws PublishException {
        
        UserEntity receiver = userRepository.findById(UUID.fromString(contentDTO.getTarget()))
                .orElseThrow(() -> new IllegalArgumentException("Destinatário não encontrado"));

        MessageEntity messageEntity = MessageEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .type(contentDTO.getType())
                .content(contentDTO.getContent())
                .build();

        MessageEntity savedMessage = messageRepository.saveAndFlush(messageEntity);

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
        return messageRepository.findConversation(
                UUID.fromString(fromUserId), 
                UUID.fromString(toUserId), 
                FromType.USER);
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
