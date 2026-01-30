package com.lendtracker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private String role;
    private Boolean emailVerified;
    private String message;
    
    public static AuthResponse success(String token, Long userId, String name, String email, String role) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(userId)
                .name(name)
                .email(email)
                .role(role)
                .emailVerified(true)
                .message("Success")
                .build();
    }
    
    public static AuthResponse error(String message) {
        return AuthResponse.builder()
                .message(message)
                .build();
    }
}
