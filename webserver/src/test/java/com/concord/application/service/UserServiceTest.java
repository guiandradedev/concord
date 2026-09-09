package com.concord.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.concord.application.database.repository.IUserRepository;
import com.concord.application.domain.dto.UserSearchResultDTO;
import com.concord.application.domain.model.UserEntity;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private IUserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldSearchByTrimmedNameAndExcludeCurrentUser() {
        UUID currentUserId = UUID.randomUUID();
        UserEntity currentUser = UserEntity.builder()
                .id(currentUserId)
                .name("Current user")
                .build();
        UserEntity result = UserEntity.builder()
                .id(UUID.randomUUID())
                .name("Maria")
                .email("maria@example.com")
                .build();

        when(userRepository.findTop20ByNameContainingIgnoreCaseAndIdNotOrderByNameAsc(
                "maria",
                currentUserId
        )).thenReturn(List.of(result));

        List<UserSearchResultDTO> users = userService.searchByName("  maria  ", currentUser);

        assertThat(users).containsExactly(new UserSearchResultDTO(result.getId(), "Maria"));
        verify(userRepository).findTop20ByNameContainingIgnoreCaseAndIdNotOrderByNameAsc(
                "maria",
                currentUserId
        );
    }

    @Test
    void shouldNotQueryRepositoryWhenSearchIsBlank() {
        UserEntity currentUser = UserEntity.builder()
                .id(UUID.randomUUID())
                .name("Current user")
                .build();

        assertThat(userService.searchByName("   ", currentUser)).isEmpty();
        verify(userRepository, never())
                .findTop20ByNameContainingIgnoreCaseAndIdNotOrderByNameAsc(
                        org.mockito.ArgumentMatchers.anyString(),
                        org.mockito.ArgumentMatchers.any(UUID.class)
                );
    }
}
