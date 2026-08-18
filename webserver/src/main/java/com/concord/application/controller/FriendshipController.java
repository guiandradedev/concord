package com.concord.application.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor // Usado no construtor para injeção de dependências
public class FriendshipController {
    
    @GetMapping("/")
    public void getMyFriends() {
    }
}
