package com.dochub.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String token;

    // Constructor thành công
    public AuthResponse(Long id, String username, String email, String fullName, String role, String token) {
        this.success = true;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.token = token;
    }

    // Constructor lỗi
    public AuthResponse(String errorMessage) {
        this.success = false;
        this.message = errorMessage;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public String getToken() { return token; }
}
