package com.concord.application.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.concord.application.domain.model.MessageEntity;

import java.util.UUID;


public interface IMessageRepository extends JpaRepository<MessageEntity, UUID> {
        
}