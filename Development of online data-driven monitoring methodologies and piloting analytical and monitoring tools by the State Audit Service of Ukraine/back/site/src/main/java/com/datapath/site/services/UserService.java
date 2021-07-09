package com.datapath.site.services;

import com.datapath.persistence.entities.monitoring.BucketItem;
import com.datapath.persistence.entities.monitoring.User;
import com.datapath.persistence.repositories.monitoring.BucketRepository;
import com.datapath.persistence.repositories.monitoring.RoleRepository;
import com.datapath.persistence.repositories.monitoring.UserRepository;
import com.datapath.site.dto.ApplicationUser;
import com.datapath.site.dto.PasswordDTO;
import com.datapath.site.dto.ResetPasswordRequest;
import com.datapath.site.dto.ResetPasswordSendRequest;
import com.datapath.site.exceptions.UserAlreadyExistException;
import com.datapath.site.security.ConfirmationTokenStorageService;
import com.datapath.site.security.UserStorageService;
import com.datapath.site.util.UserUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.MessageFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@AllArgsConstructor
public class UserService {

    private static final String RESET_PASSWORD_MESSAGE = "%s/reset-password?token=%s";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final BucketRepository bucketRepository;
    private final NotificationService notificationService;
    private final ConfirmationTokenStorageService tokenStorageService;

    @Transactional
    public ApplicationUser findByEmail(String email) {
        ApplicationUser applicationUser = new ApplicationUser();
        User dbUser = userRepository.findByEmail(email);
        BeanUtils.copyProperties(dbUser, applicationUser);
        applicationUser.setRole(dbUser.getRole().getRole());
        return applicationUser;
    }

    @Transactional
    public User findDBUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User findDBUserById(Long id) {
        return userRepository.findOneById(id);
    }

    public boolean isCredentialsCorrect(ApplicationUser credentials, ApplicationUser appUser) {
        return appUser == null || !new BCryptPasswordEncoder().matches(credentials.getPassword(), appUser.getPassword());
    }

    @Transactional
    public ApplicationUser findById(Long id) {
        return UserUtils.convertToDTO(userRepository.findOneById(id));
    }

    public List<ApplicationUser> list() {
        return userRepository.findAll().stream().map(UserUtils::convertToDTO).collect(Collectors.toList());
    }

    public ApplicationUser create(ApplicationUser appUser) {
        User existed = userRepository.findByEmail(appUser.getEmail());
        if (existed != null) {
            throw new UserAlreadyExistException();
        }
        User user = new User();
        BeanUtils.copyProperties(appUser, user);
        user.setPassword(bCryptPasswordEncoder.encode(appUser.getPassword()));
        user.setRole(roleRepository.findByRole(appUser.getRole()));
        return UserUtils.convertToDTO(userRepository.save(user));
    }

    public void updatePassword(PasswordDTO passwordDTO, Long userId) {
        User existed = userRepository.findOneById(userId);
        if (existed == null) {
            throw new UsernameNotFoundException(MessageFormat.format("User with id {0} not found", userId));
        }
        if (!bCryptPasswordEncoder.matches(passwordDTO.getOldPassword(), existed.getPassword())) {
            throw new BadCredentialsException("Old password is not matched");
        }
        existed.setPassword(bCryptPasswordEncoder.encode(passwordDTO.getNewPassword()));
        userRepository.save(existed);

        UserStorageService.remove(existed.getEmail());
    }

    public void updatePassword(String newPassword, Long userId) {
        User existed = userRepository.findOneById(userId);
        if (existed == null) {
            throw new UsernameNotFoundException(MessageFormat.format("User with id {0} not found", userId));
        }

        existed.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(existed);

        UserStorageService.remove(existed.getEmail());
    }

    public ApplicationUser update(ApplicationUser user) {
        User existedUser = userRepository.findOneById(user.getId());
        existedUser.setRole(roleRepository.findByRole(user.getRole()));
        existedUser.setEmail(user.getEmail());
        existedUser.setFirstName(user.getFirstName());
        existedUser.setLastName(user.getLastName());
        existedUser.setRegion(user.getRegion());
        return UserUtils.convertToDTO(userRepository.save(existedUser));
    }

    @Transactional
    public void delete(Long id) {
        String userEmail = userRepository.findOneById(id).getEmail();
        User user = userRepository.findOneById(id);

        List<BucketItem> assignedToUser = bucketRepository.findAllByAssigned(user);
        assignedToUser.forEach(b -> b.setAssigned(b.getUser()));
        bucketRepository.saveAll(assignedToUser);

        bucketRepository.deleteAllByUser(user);

        userRepository.delete(user);
        UserStorageService.remove(userEmail);
    }

    public void sendMailForResetPassword(ResetPasswordSendRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (isNull(user)) throw new UsernameNotFoundException("User not found");

        String token = UUID.randomUUID().toString();

        String message = String.format(RESET_PASSWORD_MESSAGE,
                request.getPath(),
                token);

        notificationService.send(user.getEmail(), message);
        tokenStorageService.add(user.getEmail(), token);
    }

    public void checkTokenForResetPassword(String token) {
        if (!tokenStorageService.isPresent(token)) throw new RuntimeException("Confirmation token is expired");
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (tokenStorageService.isPresent(request.getToken())) {
            String email = tokenStorageService.getEmail(request.getToken());
            User user = userRepository.findByEmail(email);

            if (nonNull(user)) {
                String encodedNewPassword = bCryptPasswordEncoder.encode(request.getPassword());
                user.setPassword(encodedNewPassword);
                userRepository.save(user);
                tokenStorageService.removed(email);
                UserStorageService.remove(user.getEmail());
            } else {
                throw new UsernameNotFoundException("User not found");
            }

        } else {
            throw new RuntimeException("Confirmation token is expired");
        }
    }
}
