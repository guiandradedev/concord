package com.concord.application.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.concord.application.dto.message.SendMessageDTO;
import com.concord.application.service.MessageService;

import lombok.RequiredArgsConstructor;
import com.concord.application.dto.message.FromType;


@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping({"", "/"})
    @ResponseStatus(HttpStatus.CREATED)
    public void sendMessage(@RequestBody SendMessageDTO dto) {
        messageService.send(dto);
    }

    @GetMapping({"", "/"})
    public String getMethodName() {
        // messageService.send("Oi");
        SendMessageDTO dto = new SendMessageDTO();
        dto.setFrom("user1");
        dto.setTarget("channel1");
        dto.setType(FromType.USER);
        dto.setContent("Oi");
        messageService.send(dto);

        return "Oi";
    }

}
