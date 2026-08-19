package com.concord.application.database.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.concord.application.domain.dto.message.FromType;
import com.concord.application.domain.model.MessageEntity;

@Repository
public interface IMessageRepository extends JpaRepository<MessageEntity, UUID> {
    List<MessageEntity> findBySenderAndReceiverAndType(
            String sender,
            String receiver,
            FromType type);
}