// package com.concord.application.service;

// import com.concord.database.repository.IUserRepository;
// import com.concord.dto.UserDTO;
// import com.concord.exception.AlreadyExistsException;
// import com.concord.model.UserEntity;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// @RequiredArgsConstructor
// public class UserService {

// //    @Autowired
// //    private NomeDoService service;

//     private final IUserRepository userRepository;

//     public void createUser(UserDTO user) throws AlreadyExistsException {
// //        UserEntity entity =  new UserEntity();
// //        entity.setName(user.getName());
// //        entity.setEmail(user.getEmail());

//         Optional<UserEntity> userExists = userRepository.findByEmail(user.getEmail());

//         if (userExists.isPresent()) {
//             throw new AlreadyExistsException("Email already exists");
//         }

//         UserEntity entity = UserEntity.builder()
//                 .name(user.getName())
//                 .email(user.getEmail()).build();
//         this.userRepository.save(entity);
//     }

//     public List<UserEntity> findAll() {
//         return this.userRepository.findAll();
//     }
// }
