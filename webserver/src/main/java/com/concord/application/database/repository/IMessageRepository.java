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
    List<MessageEntity> findBySenderAndReceiverAndType(
            String sender,
            String receiver,
            FromType type);

    @Query("SELECT DISTINCT CASE WHEN m.sender = :userId THEN m.receiver ELSE m.sender END " +
           "FROM MessageEntity m " +
           "WHERE (m.sender = :userId OR m.receiver = :userId) " +
           "AND m.type IN :types")
    List<String> findChatPartnersByUserIdAndTypes(
            @Param("userId") String userId,
            @Param("types") List<FromType> types);
}