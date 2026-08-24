package com.concord.application.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.concord.application.domain.dto.message.MessageResponse;
import com.concord.application.domain.dto.message.SendMessageDTO;
import com.concord.application.domain.dto.message.SendMessageRequest;
import com.concord.application.domain.model.UserEntity;
import com.concord.application.exception.NotFoundException;
import com.concord.application.exception.PublishException;
import com.concord.application.service.MessageService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping({"", "/"})
    @ResponseStatus(HttpStatus.CREATED)
    public void sendMessage(
        HttpServletRequest request, 
        @Valid @RequestBody SendMessageRequest dto,
        @AuthenticationPrincipal UserEntity user
    ) throws PublishException {
        SendMessageDTO messageDTO = SendMessageDTO.fromRequest(dto, user.getId());
        messageService.sendMessage(messageDTO);
    }

    @GetMapping({"", "/recent"})
    @ResponseStatus(HttpStatus.OK)
    public List<MessageResponse> getRecentMessages(
        @AuthenticationPrincipal UserEntity user
    ) {
        // Lista os usuários e grupos recentes com quem o usuário logado trocou mensagens
        return messageService.getRecentMessages(user.getId())
            .stream()
            .map(MessageResponse::fromEntity)
            .toList();
    }

    @GetMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<MessageResponse> getMessagesFromUser(
        @PathVariable String userId,
        @AuthenticationPrincipal UserEntity user
    ) throws NotFoundException {
        // TODO: add validation: 
        // - user has permission to get messages from userId
        
        UUID toUserId = UUID.fromString(userId);

        return messageService.getMessagesFromUser(user.getId(), toUserId)
            .stream()
            .map(MessageResponse::fromEntity)
            .toList();
    }

    @GetMapping("/channel/{channelId}")
    @ResponseStatus(HttpStatus.OK)
    public void getMessagesFromOK(@PathVariable String channelId) {
        // Lista as mensagens trocadas em um canal específico
    }
}
