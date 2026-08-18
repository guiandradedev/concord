package com.concord.application.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.concord.application.database.repository.IMessageRepository;
import com.concord.application.dto.message.SendMessageDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final KafkaTemplate<String, SendMessageDTO> kafkaTemplate;

    private final IMessageRepository messageRepository;

    public void send(SendMessageDTO contentDTO) {
        System.out.println("Sending message: " + contentDTO);
        messageRepository.save(contentDTO.toEntity());
        kafkaTemplate.send("my-topic", contentDTO);
    }
}
