package com.lendtracker.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:5173}")
    private String baseUrl;

    @Value("${app.name:LendTracker}")
    private String appName;

    private String formatCurrency(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        return formatter.format(amount);
    }

    // ==================== EMAIL VERIFICATION OTP ====================

    @Async
    public void sendVerificationOtpEmail(String toEmail, String userName, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(appName + " - Verify Your Email");
            
            String htmlContent = buildOtpEmailHtml(userName, otp);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Verification OTP email sent to: {}", toEmail);
            
        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            // Log OTP for development
            log.info("DEV MODE - OTP for {}: {}", toEmail, otp);
        } catch (Exception e) {
            log.error("Email service error: {}", e.getMessage());
            log.info("DEV MODE - OTP for {}: {}", toEmail, otp);
        }
    }

    private String buildOtpEmailHtml(String userName, String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: #1CC29F; padding: 25px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">%s</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Verify Your Email</h2>
                        
                        <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                            Hi <strong style="color: #1CC29F;">%s</strong>,
                        </p>
                        
                        <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                            Welcome to LendTracker! Please use the following OTP to verify your email address:
                        </p>
                        
                        <!-- OTP Box -->
                        <div style="text-align: center; margin: 25px 0;">
                            <div style="display: inline-block; background: #f0f9f6; border: 2px dashed #1CC29F; border-radius: 12px; padding: 20px 40px;">
                                <span style="font-size: 36px; font-weight: 700; color: #1CC29F; letter-spacing: 8px;">%s</span>
                            </div>
                        </div>
                        
                        <p style="color: #999; font-size: 13px; text-align: center; margin: 20px 0 0 0;">
                            This OTP will expire in <strong>10 minutes</strong>.
                        </p>
                        
                        <div style="background: #fff3cd; border-radius: 8px; padding: 12px; margin: 25px 0 0 0;">
                            <p style="color: #856404; font-size: 13px; margin: 0; text-align: center;">
                                ⚠️ If you didn't create an account, please ignore this email.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; margin: 0;">© 2026 %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(appName, userName, otp, appName);
    }

    // ==================== LOAN NOTIFICATIONS ====================

    @Async
    public void sendNewLoanEmail(String toEmail, String userName, String borrowerName, BigDecimal amount, double interestRate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(appName + " - New Loan Added: " + borrowerName);
            
            String htmlContent = buildNewLoanEmailHtml(userName, borrowerName, amount, interestRate);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("New loan notification sent to: {}", toEmail);
            
        } catch (Exception e) {
            log.error("Failed to send new loan email: {}", e.getMessage());
        }
    }

    private String buildNewLoanEmailHtml(String userName, String borrowerName, BigDecimal amount, double interestRate) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="background: #1CC29F; padding: 25px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">%s</h1>
                    </div>
                    <div style="padding: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 48px;">💰</span>
                        </div>
                        <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px; text-align: center;">New Loan Added</h2>
                        
                        <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">Hi <strong>%s</strong>,</p>
                        
                        <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">
                            A new loan has been recorded in your LendTracker account:
                        </p>
                        
                        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
                            <table style="width: 100%%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Borrower</td>
                                    <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Amount</td>
                                    <td style="padding: 8px 0; color: #1CC29F; font-size: 18px; text-align: right; font-weight: 700;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Interest Rate</td>
                                    <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">%.1f%% p.a.</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="%s" style="display: inline-block; background: #1CC29F; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                View in LendTracker
                            </a>
                        </div>
                    </div>
                    <div style="background: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; margin: 0;">© 2026 %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(appName, userName, borrowerName, formatCurrency(amount), interestRate, baseUrl, appName);
    }

    @Async
    public void sendLoanClosedEmail(String toEmail, String userName, String borrowerName, BigDecimal principalAmount, 
                                    BigDecimal totalInterestReceived, BigDecimal totalPrincipalReceived) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(appName + " - Loan Closed: " + borrowerName);
            
            String htmlContent = buildLoanClosedEmailHtml(userName, borrowerName, principalAmount, 
                                                          totalInterestReceived, totalPrincipalReceived);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Loan closed notification sent to: {}", toEmail);
            
        } catch (Exception e) {
            log.error("Failed to send loan closed email: {}", e.getMessage());
        }
    }

    private String buildLoanClosedEmailHtml(String userName, String borrowerName, BigDecimal principalAmount,
                                            BigDecimal totalInterestReceived, BigDecimal totalPrincipalReceived) {
        BigDecimal totalReceived = totalInterestReceived.add(totalPrincipalReceived);
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="background: #22c55e; padding: 25px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">%s</h1>
                    </div>
                    <div style="padding: 30px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 48px;">✅</span>
                        </div>
                        <h2 style="color: #22c55e; margin: 0 0 15px 0; font-size: 20px; text-align: center;">Loan Closed!</h2>
                        
                        <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">Hi <strong>%s</strong>,</p>
                        
                        <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">
                            Great news! The following loan has been fully repaid and closed:
                        </p>
                        
                        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; margin: 20px 0;">
                            <table style="width: 100%%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Borrower</td>
                                    <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right; font-weight: 600;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Principal Amount</td>
                                    <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Interest Received</td>
                                    <td style="padding: 8px 0; color: #22c55e; font-size: 14px; text-align: right; font-weight: 600;">+ %s</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Principal Received</td>
                                    <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">%s</td>
                                </tr>
                                <tr style="border-top: 2px solid #bbf7d0;">
                                    <td style="padding: 12px 0 8px 0; color: #333; font-size: 15px; font-weight: 600;">Total Received</td>
                                    <td style="padding: 12px 0 8px 0; color: #22c55e; font-size: 18px; text-align: right; font-weight: 700;">%s</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="%s" style="display: inline-block; background: #22c55e; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                View Details
                            </a>
                        </div>
                    </div>
                    <div style="background: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; margin: 0;">© 2026 %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(appName, userName, borrowerName, formatCurrency(principalAmount), 
                         formatCurrency(totalInterestReceived), formatCurrency(totalPrincipalReceived),
                         formatCurrency(totalReceived), baseUrl, appName);
    }

    // ==================== PASSWORD RESET ====================

    @Async
    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        try {
            String resetLink = baseUrl + "/reset-password?token=" + resetToken;
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(appName + " - Password Reset Request");
            
            String htmlContent = buildPasswordResetEmailHtml(userName, resetLink);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);
            
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            log.info("DEV MODE - Reset link for {}: {}/reset-password?token={}", toEmail, baseUrl, resetToken);
        } catch (Exception e) {
            log.error("Email service error: {}", e.getMessage());
            log.info("DEV MODE - Reset link for {}: {}/reset-password?token={}", toEmail, baseUrl, resetToken);
        }
    }

    private String buildPasswordResetEmailHtml(String userName, String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="background: #1CC29F; padding: 25px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">%s</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Password Reset</h2>
                        <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">Hi <strong>%s</strong>,</p>
                        <p style="color: #666; font-size: 15px; margin: 0 0 25px 0;">
                            Click the button below to reset your password:
                        </p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="%s" style="display: inline-block; background: #1CC29F; color: white; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px; margin: 25px 0 0 0;">
                            Or copy this link: <br>
                            <span style="color: #1CC29F; word-break: break-all;">%s</span>
                        </p>
                        <div style="background: #fef3cd; border-radius: 8px; padding: 12px; margin: 20px 0 0 0;">
                            <p style="color: #856404; font-size: 13px; margin: 0;">⚠️ This link expires in 1 hour.</p>
                        </div>
                    </div>
                    <div style="background: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; margin: 0;">© 2026 %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(appName, userName, resetLink, resetLink, appName);
    }

    @Async
    public void sendPasswordChangedEmail(String toEmail, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(appName + " - Password Changed");
            
            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"></head>
                <body style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;">
                    <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="background: #1CC29F; padding: 25px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">%s</h1>
                        </div>
                        <div style="padding: 30px;">
                            <div style="text-align: center; margin-bottom: 15px;"><span style="font-size: 40px;">🔒</span></div>
                            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px; text-align: center;">Password Changed</h2>
                            <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">Hi <strong>%s</strong>,</p>
                            <p style="color: #666; font-size: 15px;">Your password has been successfully changed.</p>
                            <div style="background: #fee2e2; border-radius: 8px; padding: 12px; margin: 20px 0 0 0;">
                                <p style="color: #dc2626; font-size: 13px; margin: 0;">⚠️ If you didn't make this change, contact support immediately.</p>
                            </div>
                        </div>
                        <div style="background: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px; margin: 0;">© 2026 %s</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(appName, userName, appName);
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Password changed notification sent to: {}", toEmail);
            
        } catch (Exception e) {
            log.error("Failed to send password changed email: {}", e.getMessage());
        }
    }
}
