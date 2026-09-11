package com.concord.application.adapters.out.messaging.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.concord.application.domain.ports.out.MessagePublisher;
import com.concord.application.exception.PublishException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class KafkaPublisher implements MessagePublisher {

    private final ObjectMapper mapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Override
    public <T> void publish(Message<T> message) throws PublishException {
        try {
            String payload = mapper.writeValueAsString(message.payload());
            kafkaTemplate.send(message.topic(), message.key(), payload).get();
        } catch (Exception e) {
            throw new PublishException("Failed to publish message " + message.id(), e);
        }
    }
}