package com.dochub.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            if (authentication.getPrincipal() instanceof Long) {
                return (Long) authentication.getPrincipal(); // From JWT Subject
            }
        }
        return null; // Handle default user logic or return null depending on context
    }
}