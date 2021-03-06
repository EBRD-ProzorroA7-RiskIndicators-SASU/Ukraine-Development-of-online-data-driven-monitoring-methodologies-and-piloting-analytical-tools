package com.datapath.site.api.rest.controller;

import com.datapath.site.api.version.ApiVersion;
import com.datapath.site.dto.ApplicationUser;
import com.datapath.site.dto.PasswordDTO;
import com.datapath.site.dto.ResetPasswordRequest;
import com.datapath.site.dto.ResetPasswordSendRequest;
import com.datapath.site.exceptions.IncorrectLoginOrPasswordException;
import com.datapath.site.security.TokenGenerator;
import com.datapath.site.security.UserStorageService;
import com.datapath.site.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

import static com.datapath.site.security.SecurityConstants.HEADER_STRING;
import static com.datapath.site.security.SecurityConstants.TOKEN_PREFIX;

@CrossOrigin(origins = "*")
@RestController
public class UserManagementController {

    private final UserService userService;

    @Autowired
    public UserManagementController(UserService userService) {
        this.userService = userService;
    }

    @ApiVersion({0.1})
    @PostMapping("/monitoring/login")
    public SortedMap<String, Object> login(HttpServletRequest request, HttpServletResponse httpServletResponse) throws IOException {
        ApplicationUser credentials = new ObjectMapper().readValue(request.getInputStream(), ApplicationUser.class);
        ApplicationUser appUser = userService.findByEmail(credentials.getEmail());
        if (userService.isCredentialsCorrect(credentials, appUser)) {
            throw new IncorrectLoginOrPasswordException();
        }
        String jwt = TokenGenerator.generate(appUser);
        httpServletResponse.addHeader(HEADER_STRING, TOKEN_PREFIX + " " + jwt);
        TreeMap<String, Object> treeMap = new TreeMap<>();
        treeMap.put("token", jwt);

        UserStorageService.add(appUser.getEmail());

        return treeMap;
    }

    @ApiVersion({0.1})
    @GetMapping("/monitoring/users")
    public List<ApplicationUser> list() {
        return userService.list();
    }

    @ApiVersion({0.1})
    @PutMapping("/monitoring/users")
    public ApplicationUser create(@RequestBody ApplicationUser appUser) {
        return userService.create(appUser);
    }

    @ApiVersion({0.1})
    @GetMapping("/monitoring/users/{id}")
    public ApplicationUser get(@PathVariable Long id) {
        return userService.findById(id);
    }

    @ApiVersion({0.1})
    @PostMapping("/monitoring/users")
    public ApplicationUser update(@RequestBody ApplicationUser user) {
        return userService.update(user);
    }

    @ApiVersion({0.1})
    @DeleteMapping("/monitoring/users/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @ApiVersion({0.1})
    @PostMapping("/monitoring/users/password/change/{id}")
    public void changePassword(@RequestBody PasswordDTO passwordDTO, @PathVariable Long id) {
        userService.updatePassword(passwordDTO, id);
    }

    @ApiVersion({0.1})
    @PostMapping("/monitoring/self")
    public ApplicationUser updateSelf(@RequestBody ApplicationUser user) {
        return userService.update(user);
    }

    @ApiVersion({0.1})
    @PostMapping("/monitoring/self/password/change/{id}")
    public void changeSelfPassword(@RequestBody PasswordDTO passwordDTO, @PathVariable Long id) {
        userService.updatePassword(passwordDTO.getNewPassword(), id);
    }

    @ApiVersion({0.1})
    @PostMapping("monitoring/password/reset/mail")
    public void sendMailResetPassword(@Valid @RequestBody ResetPasswordSendRequest request) {
        userService.sendMailForResetPassword(request);
    }

    @ApiVersion({0.1})
    @GetMapping("monitoring/password/reset/check")
    public void checkResetPassword(@RequestParam String token) {
        userService.checkTokenForResetPassword(token);
    }

    @ApiVersion({0.1})
    @PostMapping("monitoring/password/reset/save")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
    }
}