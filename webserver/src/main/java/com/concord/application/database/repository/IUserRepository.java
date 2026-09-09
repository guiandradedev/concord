package com.concord.application.database.repository;

import com.concord.application.domain.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUserRepository extends JpaRepository<UserEntity, UUID> {

    UserDetails findByEmail(String email);

    Optional<UserEntity> findById(UUID id);

    List<UserEntity> findTop20ByNameContainingIgnoreCaseAndIdNotOrderByNameAsc(
            String name,
            UUID excludedUserId
    );
}
