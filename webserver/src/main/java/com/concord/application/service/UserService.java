package com.concord.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.concord.application.database.repository.IUserRepository;
import com.concord.application.domain.dto.UserSearchResultDTO;
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

    public List<UserSearchResultDTO> searchByName(String name, UserEntity currentUser) {
        String normalizedName = name == null ? "" : name.trim();

        if (normalizedName.isEmpty()) {
            return List.of();
        }

        return userRepository
                .findTop20ByNameContainingIgnoreCaseAndIdNotOrderByNameAsc(
                        normalizedName,
                        currentUser.getId()
                )
                .stream()
                .map(user -> new UserSearchResultDTO(user.getId(), user.getName()))
                .toList();
    }
}
