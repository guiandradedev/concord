package com.concord.application.service;

import java.time.Instant;
import java.util.Map;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.concord.application.database.repository.IMessageRepository;
import com.concord.application.domain.ports.out.MessagePublisher;
import com.concord.application.dto.message.SendMessageDTO;
import com.concord.application.exception.PublishException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessagePublisher messagePublisher;

    private final IMessageRepository messageRepository;

    public void send(SendMessageDTO contentDTO) throws PublishException{
        System.out.println("Sending message: " + contentDTO);
        messageRepository.save(contentDTO.toEntity());
        MessagePublisher.Message<SendMessageDTO> message = new MessagePublisher.Message<>(
                null,
                "my-topic",
                contentDTO.getTarget(),
                contentDTO,
                Map.of(),
                Instant.now(),
                null);

        messagePublisher.publish(message);
    }
}
