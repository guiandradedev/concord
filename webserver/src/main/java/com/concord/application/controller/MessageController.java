package com.concord.application.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.concord.application.domain.dto.message.SendMessageDTO;
import com.concord.application.exception.PublishException;
import com.concord.application.service.MessageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping({"", "/"})
    @ResponseStatus(HttpStatus.CREATED)
    public void sendMessage(@Valid @RequestBody SendMessageDTO dto) throws PublishException {
        messageService.sendMessage(dto);
    }

    @GetMapping({"", "/recent"})
    @ResponseStatus(HttpStatus.CREATED)
    public void getRecentMessages() {
        // Lista os usuários e grupos recentes com quem o usuário logado trocou mensagens
    }

    @GetMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void getMessagesFromUser(@PathVariable String userId) {
        // Lista as mensagens trocadas com um usuário específico
        String loggedUserId = "fcc248a8-35b3-4231-961b-382d43d10175"; // Substituir pelo id que vem do auth middleware
        messageService.getMessagesFromUser(loggedUserId, userId);
    }

    @GetMapping("/channel/{channelId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void getMessagesFromChannel(@PathVariable String channelId) {
        // Lista as mensagens trocadas em um canal específico
    }
}
