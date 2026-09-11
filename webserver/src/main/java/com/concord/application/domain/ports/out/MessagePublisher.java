package com.concord.application.domain.ports.out;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import com.concord.application.exception.PublishException;

public interface MessagePublisher {
    <T> void publish(Message<T> message) throws PublishException;

    record Message<T>(
        UUID id,
        String topic,
        String key, // routing key (RabbitMQ) ou partition key (Kafka)
        T payload,
        Map<String, String> headers,
        Instant timestamp,
        String correlationId
    ) {}
}