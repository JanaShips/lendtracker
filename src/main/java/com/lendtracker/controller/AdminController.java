package com.lendtracker.controller;

import com.lendtracker.entity.User;
import com.lendtracker.service.AdminService;
import com.lendtracker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    // ==================== ADMIN CHECK ====================

    private void checkAdminAccess(Authentication authentication) {
        User currentUser = authService.getCurrentUser(authentication);
        if (!currentUser.isAdmin()) {
            throw new RuntimeException("Access denied. Admin privileges required.");
        }
    }

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers(Authentication authentication) {
        checkAdminAccess(authentication);
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> getUserDetails(
            @PathVariable Long userId,
            Authentication authentication) {
        checkAdminAccess(authentication);
        return ResponseEntity.ok(adminService.getUserDetails(userId));
    }

    @PostMapping("/users/{userId}/toggle-status")
    public ResponseEntity<Map<String, String>> toggleUserStatus(
            @PathVariable Long userId,
            Authentication authentication) {
        checkAdminAccess(authentication);
        adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(Map.of("message", "User status updated successfully"));
    }

    @PostMapping("/users/{userId}/make-admin")
    public ResponseEntity<Map<String, String>> makeUserAdmin(
            @PathVariable Long userId,
            Authentication authentication) {
        checkAdminAccess(authentication);
        adminService.makeUserAdmin(userId);
        return ResponseEntity.ok(Map.of("message", "User promoted to admin"));
    }

    @PostMapping("/users/{userId}/remove-admin")
    public ResponseEntity<Map<String, String>> removeAdminRole(
            @PathVariable Long userId,
            Authentication authentication) {
        checkAdminAccess(authentication);
        adminService.removeAdminRole(userId);
        return ResponseEntity.ok(Map.of("message", "Admin role removed"));
    }

    // ==================== SYSTEM STATISTICS ====================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats(Authentication authentication) {
        checkAdminAccess(authentication);
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    // ==================== ACTIVITY LOG ====================

    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity(
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        checkAdminAccess(authentication);
        return ResponseEntity.ok(adminService.getRecentActivity(limit));
    }

    // ==================== CHECK ADMIN STATUS ====================

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAdminStatus(Authentication authentication) {
        User currentUser = authService.getCurrentUser(authentication);
        return ResponseEntity.ok(Map.of(
                "isAdmin", currentUser.isAdmin(),
                "role", currentUser.getRole().name()
        ));
    }
}
