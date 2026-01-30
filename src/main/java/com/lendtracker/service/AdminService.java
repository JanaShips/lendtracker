package com.lendtracker.service;

import com.lendtracker.entity.Loan;
import com.lendtracker.entity.User;
import com.lendtracker.repository.LoanRepository;
import com.lendtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    // ==================== USER MANAGEMENT ====================

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToDto)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> details = mapUserToDto(user);
        
        // Add loan statistics
        List<Loan> userLoans = loanRepository.findByUser(user);
        details.put("totalLoans", userLoans.size());
        details.put("activeLoans", userLoans.stream().filter(l -> l.getStatus() == Loan.LoanStatus.ACTIVE).count());
        details.put("totalLentAmount", userLoans.stream()
                .map(Loan::getPrincipalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        return details;
    }

    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.isAdmin()) {
            throw new RuntimeException("Cannot deactivate admin users");
        }
        
        user.setActive(!user.getActive());
        userRepository.save(user);
    }

    @Transactional
    public void makeUserAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.ADMIN);
        userRepository.save(user);
    }

    @Transactional
    public void removeAdminRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.USER);
        userRepository.save(user);
    }

    // ==================== SYSTEM STATISTICS ====================

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        List<User> allUsers = userRepository.findAll();
        List<Loan> allLoans = loanRepository.findAll();
        
        // User stats
        stats.put("totalUsers", allUsers.size());
        stats.put("activeUsers", allUsers.stream().filter(u -> Boolean.TRUE.equals(u.getActive())).count());
        stats.put("adminUsers", allUsers.stream().filter(User::isAdmin).count());
        stats.put("newUsersToday", allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
                .count());
        stats.put("newUsersThisWeek", allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(LocalDateTime.now().minusWeeks(1)))
                .count());
        stats.put("newUsersThisMonth", allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(LocalDateTime.now().minusMonths(1)))
                .count());
        
        // Loan stats
        stats.put("totalLoans", allLoans.size());
        stats.put("activeLoans", allLoans.stream().filter(l -> l.getStatus() == Loan.LoanStatus.ACTIVE).count());
        stats.put("closedLoans", allLoans.stream().filter(l -> l.getStatus() == Loan.LoanStatus.CLOSED).count());
        stats.put("defaultedLoans", allLoans.stream().filter(l -> l.getStatus() == Loan.LoanStatus.DEFAULTED).count());
        
        // Financial stats
        BigDecimal totalLentOut = allLoans.stream()
                .map(Loan::getPrincipalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalLentOut", totalLentOut);
        
        BigDecimal totalInterestReceived = allLoans.stream()
                .map(l -> l.getTotalInterestReceived() != null ? l.getTotalInterestReceived() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalInterestReceived", totalInterestReceived);
        
        BigDecimal totalPrincipalReceived = allLoans.stream()
                .map(l -> l.getTotalPrincipalReceived() != null ? l.getTotalPrincipalReceived() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalPrincipalReceived", totalPrincipalReceived);
        
        // Average stats
        if (!allLoans.isEmpty()) {
            double avgInterestRate = allLoans.stream()
                    .mapToDouble(Loan::getInterestRate)
                    .average()
                    .orElse(0.0);
            stats.put("averageInterestRate", Math.round(avgInterestRate * 100.0) / 100.0);
            
            BigDecimal avgLoanAmount = totalLentOut.divide(BigDecimal.valueOf(allLoans.size()), 2, java.math.RoundingMode.HALF_UP);
            stats.put("averageLoanAmount", avgLoanAmount);
        } else {
            stats.put("averageInterestRate", 0.0);
            stats.put("averageLoanAmount", BigDecimal.ZERO);
        }
        
        // Top users by loan count
        Map<User, Long> userLoanCounts = allLoans.stream()
                .collect(Collectors.groupingBy(Loan::getUser, Collectors.counting()));
        
        List<Map<String, Object>> topUsers = userLoanCounts.entrySet().stream()
                .sorted(Map.Entry.<User, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("name", e.getKey().getName());
                    userMap.put("email", e.getKey().getEmail());
                    userMap.put("loanCount", e.getValue());
                    return userMap;
                })
                .collect(Collectors.toList());
        stats.put("topUsersByLoans", topUsers);
        
        // Loans by frequency
        Map<String, Long> loansByFrequency = allLoans.stream()
                .collect(Collectors.groupingBy(l -> l.getInterestFrequency().name(), Collectors.counting()));
        stats.put("loansByFrequency", loansByFrequency);
        
        // User growth data (last 7 days)
        List<Map<String, Object>> userGrowth = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            long count = allUsers.stream()
                    .filter(u -> u.getCreatedAt() != null && 
                            u.getCreatedAt().toLocalDate().equals(date.toLocalDate()))
                    .count();
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toLocalDate().toString());
            dayData.put("count", count);
            userGrowth.add(dayData);
        }
        stats.put("userGrowthLast7Days", userGrowth);
        
        return stats;
    }

    // ==================== RECENT ACTIVITY ====================

    public List<Map<String, Object>> getRecentActivity(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // Get recent user registrations
        List<User> recentUsers = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null)
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .limit(limit)
                .collect(Collectors.toList());
        
        for (User user : recentUsers) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "USER_REGISTERED");
            activity.put("message", user.getName() + " registered");
            activity.put("email", user.getEmail());
            activity.put("timestamp", user.getCreatedAt());
            activities.add(activity);
        }
        
        // Get recent loans
        List<Loan> recentLoans = loanRepository.findAll().stream()
                .filter(l -> l.getCreatedAt() != null)
                .sorted(Comparator.comparing(Loan::getCreatedAt).reversed())
                .limit(limit)
                .collect(Collectors.toList());
        
        for (Loan loan : recentLoans) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "LOAN_CREATED");
            activity.put("message", "Loan of ₹" + loan.getPrincipalAmount() + " to " + loan.getBorrowerName());
            activity.put("user", loan.getUser().getName());
            activity.put("timestamp", loan.getCreatedAt());
            activities.add(activity);
        }
        
        // Sort all activities by timestamp
        activities.sort((a, b) -> {
            LocalDateTime timeA = (LocalDateTime) a.get("timestamp");
            LocalDateTime timeB = (LocalDateTime) b.get("timestamp");
            return timeB.compareTo(timeA);
        });
        
        return activities.stream().limit(limit).collect(Collectors.toList());
    }

    // ==================== HELPER METHODS ====================

    private Map<String, Object> mapUserToDto(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("phone", user.getPhone());
        dto.put("role", user.getRole().name());
        dto.put("active", user.getActive());
        dto.put("createdAt", user.getCreatedAt());
        dto.put("lastLoginAt", user.getLastLoginAt());
        
        // Add loan count
        List<Loan> loans = loanRepository.findByUser(user);
        dto.put("loanCount", loans.size());
        dto.put("totalLent", loans.stream()
                .map(Loan::getPrincipalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        return dto;
    }
}
