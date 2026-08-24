package com.concord.application.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.concord.application.database.repository.IMessageRepository;
import com.concord.application.domain.dto.PublishMessageDTO;
import com.concord.application.domain.dto.message.FromType;
import com.concord.application.domain.dto.message.SendMessageDTO;
import com.concord.application.domain.model.MessageEntity;
import com.concord.application.domain.ports.out.MessagePublisher;
import com.concord.application.exception.NotFoundException;
import com.concord.application.exception.PublishException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessagePublisher messagePublisher;
    private final IMessageRepository messageRepository;
    private final UserService userService;

    private final String privateMessageTopic = "my-topic";

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

        // Prepara os dados para publicação
        UUID transactionId = UUID.randomUUID();

        PublishMessageDTO<SendMessageDTO> publishDto = new PublishMessageDTO<>();
        publishDto.setPayload(contentDTO);
        publishDto.setDestination("");
        publishDto.setHeaders(null);
        publishDto.setId(transactionId);
        publishDto.setTimestamp(Instant.now());
        publishDto.setCorrelationId(null);

        // Cria a mensagem para publicação
        MessagePublisher.Message<SendMessageDTO> message = new MessagePublisher.Message<>(
                publishDto.getId(),
                this.privateMessageTopic,
                contentDTO.getTarget(),
                contentDTO,
                Map.of(),
                publishDto.getTimestamp(),
                publishDto.getCorrelationId());

        // Salva a mensagem no banco
        messageRepository.save(contentDTO.toEntity());

        messagePublisher.publish(message);
    }

    public List<MessageEntity> getMessagesFromUser(UUID fromUserId, UUID toUserId) throws NotFoundException {
        // Lista os usuários e grupos recentes com quem o usuário logado trocou
        // mensagens
        if (fromUserId.equals(toUserId)) {
            throw new IllegalArgumentException("fromUserId and toUserId cannot be the same");
        }

        // Valida se os usuários existem dentro do service
        userService.findById(fromUserId);
        userService.findById(toUserId);

        List<MessageEntity> messages = messageRepository.findBySenderAndReceiverAndType(fromUserId.toString(),
                toUserId.toString(), FromType.USER);
        messages.forEach(message -> System.out.printf(
                "id=%s, sender=%s, receiver=%s, type=%s, content=%s%n",
                message.getId(),
                message.getSender(),
                message.getReceiver(),
                message.getType(),
                message.getContent()));
        return messages;
        // return List.of();
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
