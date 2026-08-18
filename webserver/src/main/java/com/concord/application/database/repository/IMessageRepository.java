package com.concord.application.database.repository;

import com.concord.application.model.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;


public interface IMessageRepository extends JpaRepository<MessageEntity, UUID> {
        
}