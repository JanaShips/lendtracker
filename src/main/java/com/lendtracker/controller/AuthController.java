package com.lendtracker.controller;

import com.lendtracker.dto.AuthRequest;
import com.lendtracker.dto.AuthResponse;
import com.lendtracker.dto.RegisterRequest;
import com.lendtracker.entity.User;
import com.lendtracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        
        // Registration now returns with emailVerified=false (needs OTP verification)
        if (response.getMessage() != null && response.getMessage().contains("Please verify")) {
            return ResponseEntity.ok(response);
        }
        
        // Error case
        if (response.getToken() == null && response.getUserId() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        
        // If email not verified, return OK with verification needed message
        if (Boolean.FALSE.equals(response.getEmailVerified()) && response.getUserId() != null) {
            return ResponseEntity.ok(response);
        }
        
        // Error case
        if (response.getToken() == null && response.getUserId() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    // ============================================
    // EMAIL VERIFICATION ENDPOINTS (Public)
    // ============================================

    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Email is required"));
        }
        
        if (otp == null || otp.isBlank()) {
            return ResponseEntity.badRequest().body(AuthResponse.error("OTP is required"));
        }
        
        AuthResponse response = authService.verifyEmail(email, otp);
        
        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/send-verification-otp")
    public ResponseEntity<AuthResponse> sendVerificationOtp(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(AuthResponse.error("Not authenticated"));
        }
        
        AuthResponse response = authService.sendVerificationOtp(user.getEmail());
        
        if (response.getMessage() != null && response.getMessage().contains("OTP sent")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "profilePhoto", user.getProfilePhoto() != null ? user.getProfilePhoto() : "",
                "emailVerified", user.getEmailVerified(),
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user,
                                           @RequestBody Map<String, String> updates) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        if (updates.containsKey("name") && updates.get("name") != null && !updates.get("name").isBlank()) {
            user.setName(updates.get("name"));
        }
        if (updates.containsKey("phone")) {
            user.setPhone(updates.get("phone"));
        }
        if (updates.containsKey("profilePhoto")) {
            user.setProfilePhoto(updates.get("profilePhoto"));
        }

        authService.updateUser(user);

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "name", user.getName(),
                "phone", user.getPhone() != null ? user.getPhone() : ""
        ));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal User user,
                                            @RequestBody Map<String, String> passwords) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String currentPassword = passwords.get("currentPassword");
        String newPassword = passwords.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Current and new password required"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 6 characters"));
        }

        boolean success = authService.changePassword(user, currentPassword, newPassword);
        
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
        }
    }

    // ============================================
    // PASSWORD RESET ENDPOINTS (Public)
    // ============================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        authService.requestPasswordReset(email);
        
        // Always return success for security (don't reveal if email exists)
        return ResponseEntity.ok(Map.of(
            "message", "If an account exists with this email, you will receive a password reset link shortly."
        ));
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "error", "Token is required"));
        }

        boolean valid = authService.validateResetToken(token);
        
        if (valid) {
            return ResponseEntity.ok(Map.of("valid", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false, 
                "error", "Invalid or expired reset link. Please request a new one."
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Reset token is required"));
        }

        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
        }

        boolean success = authService.resetPassword(token, newPassword);
        
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password has been reset successfully. You can now login with your new password."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset link. Please request a new one."));
        }
    }
}
