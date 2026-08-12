package com.smartlab.security;

import java.security.Principal;

public class UserPrincipal implements Principal {
    private final String email;
    private final Long userId;
    private final String role;

    public UserPrincipal(String email, Long userId, String role) {
        this.email = email;
        this.userId = userId;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public Long getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String getName() {
        return email;
    }

    @Override
    public String toString() {
        return email;
    }
}
