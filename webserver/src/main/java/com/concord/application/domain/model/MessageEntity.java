package com.concord.application.domain.model;

import java.util.UUID;

import com.concord.application.domain.dto.message.FromType;

import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "messages")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String sender; // Implementar FK

    @Column(nullable = false)
    private String receiver; // Implementar FK

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FromType type;

    @CreationTimestamp()
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
