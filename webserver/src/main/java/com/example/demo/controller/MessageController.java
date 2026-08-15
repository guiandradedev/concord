package com.example.demo.controller;

public class MessageController {

    @PostMapping()
    public void create(@Valid @RequestBody UserDTO user) throws AlreadyExistsException {
        System.out.println("Criando usuário");
        this.userService.createUser(user);
    }
}
