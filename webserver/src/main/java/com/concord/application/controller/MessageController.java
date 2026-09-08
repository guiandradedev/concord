package com.concord.application.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.concord.application.domain.dto.UserDTO;
import com.concord.application.domain.dto.message.MessageResponse;
import com.concord.application.domain.dto.message.SendMessageDTO;
import com.concord.application.domain.dto.message.SendMessageRequest;
import com.concord.application.domain.model.MessageEntity;
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
        
        messageService.sendMessage(dto, user); 
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<UserDTO>> getRecentMessages(@AuthenticationPrincipal UserEntity user) {
        List<UserDTO> recentChats = messageService.getRecentChats(user);
        return ResponseEntity.ok(recentChats);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MessageEntity>> getMessagesFromUser(
            @PathVariable String userId,
            @AuthenticationPrincipal UserEntity currentUser
    ) {
        String loggedUserId = currentUser.getId().toString();

        List<MessageEntity> historico = messageService.getMessagesFromUser(loggedUserId, userId);

        return ResponseEntity.ok(historico);
    }

    @GetMapping("/channel/{channelId}")
    @ResponseStatus(HttpStatus.OK)
    public void getMessagesFromOK(@PathVariable String channelId) {
        // Lista as mensagens trocadas em um canal específico
    }
}
