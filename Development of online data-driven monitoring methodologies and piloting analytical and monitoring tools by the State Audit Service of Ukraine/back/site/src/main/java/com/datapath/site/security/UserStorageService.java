package com.datapath.site.security;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.CopyOnWriteArraySet;

@Slf4j
public class UserStorageService {

    private static CopyOnWriteArraySet<String> EMAIL_STORAGE = new CopyOnWriteArraySet<>();

    private UserStorageService() {
    }

    public static void add(String userEmail) {
        log.info("Added user to system {}", userEmail);
        EMAIL_STORAGE.add(userEmail);
    }

    public static boolean isAuthenticatedUser(String userEmail) {
        return EMAIL_STORAGE.contains(userEmail);
    }

    public static void remove(String userEmail) {
        log.info("Removed user from system {}", userEmail);
        EMAIL_STORAGE.remove(userEmail);
    }
}
