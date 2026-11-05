package com.concord.application.adapters.out.messaging.kafka;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import com.concord.application.domain.ports.out.MessagePublisher;
import com.concord.application.exception.PublishException;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class KafkaPublisherTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    private KafkaPublisher kafkaPublisher;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        kafkaPublisher = new KafkaPublisher(objectMapper, kafkaTemplate);
    }

    @Test
    void shouldSerializePayloadAndSendToKafkaTopic() throws Exception {
        when(kafkaTemplate.send(anyString(), anyString(), anyString()))
                .thenReturn(CompletableFuture.completedFuture(null));

        Map<String, String> payload = Map.of("target", "user-1", "content", "oi");
        MessagePublisher.Message<Map<String, String>> message = new MessagePublisher.Message<>(
                UUID.randomUUID(),
                "my-topic",
                "user-1",
                payload,
                Map.of(),
                Instant.now(),
                null
        );

        kafkaPublisher.publish(message);

        String expectedJson = objectMapper.writeValueAsString(payload);
        verify(kafkaTemplate).send("my-topic", "user-1", expectedJson);
    }

    @Test
    void shouldThrowPublishExceptionWhenKafkaFails() {
        CompletableFuture<org.springframework.kafka.support.SendResult<String, String>> failedFuture =
                new CompletableFuture<>();
        failedFuture.completeExceptionally(new RuntimeException("Broker offline"));

        when(kafkaTemplate.send(anyString(), anyString(), anyString())).thenReturn(failedFuture);

        MessagePublisher.Message<String> message = new MessagePublisher.Message<>(
                UUID.randomUUID(),
                "my-topic",
                "user-1",
                "oi",
                Map.of(),
                Instant.now(),
                null
        );

        assertThatThrownBy(() -> kafkaPublisher.publish(message))
                .isInstanceOf(PublishException.class)
                .hasMessageContaining("Failed to publish message");
    }
}