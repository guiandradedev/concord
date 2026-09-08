package com.concord.application.database.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.concord.application.domain.dto.message.FromType;
import com.concord.application.domain.model.MessageEntity;
import com.concord.application.domain.model.UserEntity;

@Repository
public interface IMessageRepository extends JpaRepository<MessageEntity, UUID> {

        @Query("SELECT m FROM MessageEntity m WHERE m.sender.id = :userId OR m.receiver.id = :userId ORDER BY m.createdAt DESC")
        List<MessageEntity> findBySenderOrReceiver(@Param("userId") UUID userId);

        @Query("SELECT m FROM MessageEntity m WHERE " +
                        "((m.sender.id = :userA AND m.receiver.id = :userB) OR " +
                        "(m.sender.id = :userB AND m.receiver.id = :userA)) " +
                        "AND m.type = :type ORDER BY m.createdAt ASC")
        List<MessageEntity> findConversation(
                        @Param("userA") UUID userA,
                        @Param("userB") UUID userB,
                        @Param("type") FromType type);
}