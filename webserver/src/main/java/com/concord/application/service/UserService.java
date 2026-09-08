package com.concord.application.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.concord.application.database.repository.IUserRepository;
import com.concord.application.domain.model.UserEntity;
import com.concord.application.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final IUserRepository userRepository;

    public UserEntity findById(UUID id) throws NotFoundException {
        Optional<UserEntity> user = this.userRepository.findById(id);
        if (user.isEmpty()) {
            throw new NotFoundException("User not found");
        }
        return user.get();
    }
}
