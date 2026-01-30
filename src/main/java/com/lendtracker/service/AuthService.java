package com.lendtracker.service;

import com.lendtracker.dto.AuthRequest;
import com.lendtracker.dto.AuthResponse;
import com.lendtracker.dto.RegisterRequest;
import com.lendtracker.entity.PasswordResetToken;
import com.lendtracker.entity.User;
import com.lendtracker.repository.PasswordResetTokenRepository;
import com.lendtracker.repository.UserRepository;
import com.lendtracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    /**
     * Generate a 6-digit OTP
     */
    private String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000); // 6-digit number
        return String.valueOf(otp);
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            return AuthResponse.error("Email already registered. Please login.");
        }

        // Create new user (unverified - can verify later from settings)
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .emailVerified(false)
                .build();

        user = userRepository.save(user);

        log.info("New user registered: {}", user.getEmail());

        // Generate JWT token - allow login immediately
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getName());

        return AuthResponse.success(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    /**
     * Verify email with OTP
     */
    public AuthResponse verifyEmail(String email, String otp) {
        User user = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        
        if (user == null) {
            return AuthResponse.error("User not found.");
        }

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            return AuthResponse.error("Email is already verified.");
        }

        // Check OTP expiry
        if (user.getOtpExpiryTime() == null || user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            return AuthResponse.error("OTP has expired. Please request a new one.");
        }

        // Verify OTP
        if (!otp.equals(user.getVerificationOtp())) {
            return AuthResponse.error("Invalid OTP. Please try again.");
        }

        // Mark email as verified
        user.setEmailVerified(true);
        user.setVerificationOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getName());

        log.info("Email verified for user: {}", user.getEmail());

        return AuthResponse.success(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    /**
     * Resend verification OTP
     */
    public AuthResponse resendVerificationOtp(String email) {
        User user = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        
        if (user == null) {
            return AuthResponse.error("User not found.");
        }

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            return AuthResponse.error("Email is already verified.");
        }

        // Generate new OTP
        String otp = generateOtp();
        user.setVerificationOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationOtpEmail(user.getEmail(), user.getName(), otp);

        log.info("Verification OTP resent to: {}", user.getEmail());

        return AuthResponse.builder()
                .email(user.getEmail())
                .message("New OTP sent to " + user.getEmail())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElse(null);

        if (user == null) {
            return AuthResponse.error("No account found with this email. Please register.");
        }

        // Check if user is active
        if (!Boolean.TRUE.equals(user.getActive())) {
            return AuthResponse.error("Your account has been deactivated. Please contact support.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.error("Incorrect password. Please try again.");
        }

        // Update last login time
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token - allow login without email verification
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getName());

        // Include emailVerified status so frontend can show verification prompt
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.getEmailVerified())
                .message("Success")
                .build();
    }

    /**
     * Send verification OTP (called from settings)
     */
    public AuthResponse sendVerificationOtp(String email) {
        User user = userRepository.findByEmail(email.toLowerCase()).orElse(null);
        
        if (user == null) {
            return AuthResponse.error("User not found.");
        }

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            return AuthResponse.error("Email is already verified.");
        }

        // Generate new OTP
        String otp = generateOtp();
        user.setVerificationOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationOtpEmail(user.getEmail(), user.getName(), otp);

        log.info("Verification OTP sent to: {}", user.getEmail());

        return AuthResponse.builder()
                .email(user.getEmail())
                .message("OTP sent to " + user.getEmail())
                .build();
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public boolean changePassword(User user, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    /**
     * Request password reset - generates token and sends email
     */
    public String requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email.toLowerCase());
        
        if (userOpt.isEmpty()) {
            // Don't reveal whether email exists for security
            log.info("Password reset requested for non-existent email: {}", email);
            return "success"; // Return success anyway for security
        }

        User user = userOpt.get();
        
        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);
        
        // Create new reset token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();
        
        passwordResetTokenRepository.save(resetToken);
        
        // Send email with reset link
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
        
        log.info("Password reset token created for user: {}", user.getEmail());
        return "success";
    }

    /**
     * Validate reset token
     */
    @Transactional(readOnly = true)
    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByTokenAndUsedFalse(token);
        return tokenOpt.isPresent() && tokenOpt.get().isValid();
    }

    /**
     * Reset password using token
     */
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByTokenAndUsedFalse(token);
        
        if (tokenOpt.isEmpty()) {
            log.warn("Password reset attempted with invalid token");
            return false;
        }

        PasswordResetToken resetToken = tokenOpt.get();
        
        if (!resetToken.isValid()) {
            log.warn("Password reset attempted with expired token for user: {}", 
                resetToken.getUser().getEmail());
            return false;
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Send confirmation email
        emailService.sendPasswordChangedEmail(user.getEmail(), user.getName());

        log.info("Password successfully reset for user: {}", user.getEmail());
        return true;
    }

    /**
     * Clean up expired tokens (can be scheduled)
     */
    public void cleanupExpiredTokens() {
        passwordResetTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
