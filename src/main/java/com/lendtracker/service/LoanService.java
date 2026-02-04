package com.lendtracker.service;

import com.lendtracker.dto.InterestCalculation;
import com.lendtracker.dto.PaymentHistoryResponse;
import com.lendtracker.dto.PaymentRequest;
import com.lendtracker.entity.Loan;
import com.lendtracker.entity.PaymentHistory;
import com.lendtracker.entity.User;
import com.lendtracker.exception.LoanNotFoundException;
import com.lendtracker.repository.LoanRepository;
import com.lendtracker.repository.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LoanService {

    private final LoanRepository loanRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final EmailService emailService;

    public Loan createLoan(Loan loan, User user) {
        loan.setUser(user);
        Loan savedLoan = loanRepository.save(loan);
        
        // Send email notification for new loan
        try {
            emailService.sendNewLoanEmail(
                user.getEmail(),
                user.getName(),
                savedLoan.getBorrowerName(),
                savedLoan.getPrincipalAmount(),
                savedLoan.getInterestRate()
            );
        } catch (Exception e) {
            // Log but don't fail the loan creation
            // Email notification is not critical
        }
        
        return savedLoan;
    }

    @Transactional(readOnly = true)
    public List<Loan> getAllLoans(User user) {
        return loanRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public List<Loan> searchAndFilterLoans(
            User user,
            String search,
            String status,
            String frequency,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            Double minRate,
            Double maxRate,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        Loan.LoanStatus statusEnum = null;
        Loan.InterestFrequency frequencyEnum = null;
        
        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try {
                statusEnum = Loan.LoanStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        
        if (frequency != null && !frequency.isEmpty() && !frequency.equalsIgnoreCase("ALL")) {
            try {
                frequencyEnum = Loan.InterestFrequency.valueOf(frequency.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }
        
        String searchTerm = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        
        return loanRepository.searchAndFilter(
            user,
            searchTerm,
            statusEnum,
            frequencyEnum,
            minAmount,
            maxAmount,
            minRate,
            maxRate,
            fromDate,
            toDate
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getFilterCounts(User user) {
        Map<String, Object> counts = new HashMap<>();
        
        // Status counts
        Map<String, Long> statusCounts = new HashMap<>();
        for (Loan.LoanStatus status : Loan.LoanStatus.values()) {
            statusCounts.put(status.name(), loanRepository.countByUserAndStatus(user, status));
        }
        counts.put("byStatus", statusCounts);
        
        // Frequency counts
        Map<String, Long> frequencyCounts = new HashMap<>();
        for (Loan.InterestFrequency frequency : Loan.InterestFrequency.values()) {
            frequencyCounts.put(frequency.name(), loanRepository.countByUserAndInterestFrequency(user, frequency));
        }
        counts.put("byFrequency", frequencyCounts);
        
        return counts;
    }

    @Transactional(readOnly = true)
    public List<Loan> getActiveLoans(User user) {
        return loanRepository.findByUserAndStatus(user, Loan.LoanStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public Loan getLoanById(Long id, User user) {
        return loanRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new LoanNotFoundException(id));
    }

    public Loan updateLoan(Long id, Loan loanDetails, User user) {
        Loan existingLoan = getLoanById(id, user);
        Loan.LoanStatus previousStatus = existingLoan.getStatus();
        
        existingLoan.setBorrowerName(loanDetails.getBorrowerName());
        existingLoan.setBorrowerPhone(loanDetails.getBorrowerPhone());
        existingLoan.setBorrowerEmail(loanDetails.getBorrowerEmail());
        existingLoan.setPrincipalAmount(loanDetails.getPrincipalAmount());
        existingLoan.setInterestRate(loanDetails.getInterestRate());
        existingLoan.setLendDate(loanDetails.getLendDate());
        existingLoan.setDueDate(loanDetails.getDueDate());
        existingLoan.setInterestFrequency(loanDetails.getInterestFrequency());
        existingLoan.setTotalInterestReceived(loanDetails.getTotalInterestReceived());
        existingLoan.setTotalPrincipalReceived(loanDetails.getTotalPrincipalReceived());
        existingLoan.setNotes(loanDetails.getNotes());
        existingLoan.setStatus(loanDetails.getStatus());
        
        Loan savedLoan = loanRepository.save(existingLoan);
        
        // Send email notification if loan is being closed
        if (previousStatus != Loan.LoanStatus.CLOSED && loanDetails.getStatus() == Loan.LoanStatus.CLOSED) {
            try {
                emailService.sendLoanClosedEmail(
                    user.getEmail(),
                    user.getName(),
                    savedLoan.getBorrowerName(),
                    savedLoan.getPrincipalAmount(),
                    savedLoan.getTotalInterestReceived() != null ? savedLoan.getTotalInterestReceived() : BigDecimal.ZERO,
                    savedLoan.getTotalPrincipalReceived() != null ? savedLoan.getTotalPrincipalReceived() : BigDecimal.ZERO
                );
            } catch (Exception e) {
                // Log but don't fail the operation
            }
        }
        
        return savedLoan;
    }

    public void deleteLoan(Long id, User user) {
        Loan loan = getLoanById(id, user);
        paymentHistoryRepository.deleteByLoanId(id);
        loanRepository.delete(loan);
    }

    // Dashboard Analytics
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats(User user) {
        List<Loan> allLoans = loanRepository.findByUser(user);
        List<Loan> activeLoans = allLoans.stream()
                .filter(l -> l.getStatus() == Loan.LoanStatus.ACTIVE)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        stats.put("totalLoans", allLoans.size());
        stats.put("activeLoans", activeLoans.size());
        stats.put("closedLoans", allLoans.stream()
                .filter(l -> l.getStatus() == Loan.LoanStatus.CLOSED).count());
        
        // Financial summaries - Money you've lent out that's still outstanding
        BigDecimal totalLentOut = activeLoans.stream()
                .map(Loan::getPrincipalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalLentOut", totalLentOut);
        
        // Interest you've received back
        BigDecimal totalInterestReceived = allLoans.stream()
                .map(l -> l.getTotalInterestReceived() != null ? l.getTotalInterestReceived() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalInterestReceived", totalInterestReceived);
        
        // Principal you've received back
        BigDecimal totalPrincipalReceived = allLoans.stream()
                .map(l -> l.getTotalPrincipalReceived() != null ? l.getTotalPrincipalReceived() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalPrincipalReceived", totalPrincipalReceived);
        
        // Average interest rate
        double avgInterestRate = activeLoans.stream()
                .mapToDouble(Loan::getInterestRate)
                .average()
                .orElse(0.0);
        stats.put("averageInterestRate", Math.round(avgInterestRate * 100.0) / 100.0);
        
        // Monthly interest expected (to receive)
        BigDecimal monthlyInterestExpected = calculateTotalMonthlyInterest(activeLoans);
        stats.put("monthlyInterestExpected", monthlyInterestExpected);
        
        // Loans by frequency
        Map<String, Long> loansByFrequency = activeLoans.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getInterestFrequency().toString(),
                        Collectors.counting()
                ));
        stats.put("loansByFrequency", loansByFrequency);
        
        // Top borrowers (people who owe you the most)
        List<Map<String, Object>> topBorrowers = activeLoans.stream()
                .collect(Collectors.groupingBy(
                        Loan::getBorrowerName,
                        Collectors.reducing(BigDecimal.ZERO, Loan::getPrincipalAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> borrower = new HashMap<>();
                    borrower.put("name", e.getKey());
                    borrower.put("totalAmount", e.getValue());
                    return borrower;
                })
                .collect(Collectors.toList());
        stats.put("topBorrowers", topBorrowers);
        
        return stats;
    }

    private BigDecimal calculateTotalMonthlyInterest(List<Loan> loans) {
        BigDecimal total = BigDecimal.ZERO;
        for (Loan loan : loans) {
            // Only include loans with MONTHLY frequency in monthly interest calculation
            if (loan.getInterestFrequency() == Loan.InterestFrequency.MONTHLY) {
                BigDecimal monthlyInterest = calculateMonthlyInterest(loan);
                total = total.add(monthlyInterest);
            }
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateMonthlyInterest(Loan loan) {
        BigDecimal principal = loan.getPrincipalAmount();
        double annualRate = loan.getInterestRate() / 100.0;
        
        return switch (loan.getInterestFrequency()) {
            case DAILY -> principal.multiply(BigDecimal.valueOf(annualRate / 365 * 30));
            case WEEKLY -> principal.multiply(BigDecimal.valueOf(annualRate / 52 * 4.33));
            case BIWEEKLY -> principal.multiply(BigDecimal.valueOf(annualRate / 26 * 2.17));
            case MONTHLY -> principal.multiply(BigDecimal.valueOf(annualRate / 12));
            case QUARTERLY -> principal.multiply(BigDecimal.valueOf(annualRate / 4 / 3));
            case YEARLY -> principal.multiply(BigDecimal.valueOf(annualRate / 12));
        };
    }

    // Record interest received from borrower with history
    public Loan recordInterestReceived(Long id, PaymentRequest request, User user) {
        Loan loan = getLoanById(id, user);
        BigDecimal currentReceived = loan.getTotalInterestReceived() != null ? loan.getTotalInterestReceived() : BigDecimal.ZERO;
        loan.setTotalInterestReceived(currentReceived.add(request.getAmount()));
        
        // Create payment history record
        PaymentHistory history = PaymentHistory.builder()
                .loan(loan)
                .amount(request.getAmount())
                .paymentType(PaymentHistory.PaymentType.INTEREST)
                .paymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now())
                .notes(request.getNotes())
                .build();
        paymentHistoryRepository.save(history);
        
        return loanRepository.save(loan);
    }

    // Record principal received from borrower with history
    public Loan recordPrincipalReceived(Long id, PaymentRequest request, User user) {
        Loan loan = getLoanById(id, user);
        BigDecimal currentReceived = loan.getTotalPrincipalReceived() != null ? loan.getTotalPrincipalReceived() : BigDecimal.ZERO;
        loan.setTotalPrincipalReceived(currentReceived.add(request.getAmount()));
        
        // Create payment history record
        PaymentHistory history = PaymentHistory.builder()
                .loan(loan)
                .amount(request.getAmount())
                .paymentType(PaymentHistory.PaymentType.PRINCIPAL)
                .paymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now())
                .notes(request.getNotes())
                .build();
        paymentHistoryRepository.save(history);
        
        // Check if loan is fully repaid
        if (currentReceived.add(request.getAmount()).compareTo(loan.getPrincipalAmount()) >= 0) {
            loan.setStatus(Loan.LoanStatus.CLOSED);
            
            // Send email notification for loan closure
            try {
                emailService.sendLoanClosedEmail(
                    loan.getUser().getEmail(),
                    loan.getUser().getName(),
                    loan.getBorrowerName(),
                    loan.getPrincipalAmount(),
                    loan.getTotalInterestReceived() != null ? loan.getTotalInterestReceived() : BigDecimal.ZERO,
                    loan.getTotalPrincipalReceived() != null ? loan.getTotalPrincipalReceived() : BigDecimal.ZERO
                );
            } catch (Exception e) {
                // Log but don't fail the operation
            }
        }
        return loanRepository.save(loan);
    }
    
    // Legacy methods for backwards compatibility
    public Loan recordInterestReceived(Long id, BigDecimal amount, User user) {
        PaymentRequest request = new PaymentRequest();
        request.setAmount(amount);
        request.setPaymentDate(LocalDate.now());
        return recordInterestReceived(id, request, user);
    }
    
    public Loan recordPrincipalReceived(Long id, BigDecimal amount, User user) {
        PaymentRequest request = new PaymentRequest();
        request.setAmount(amount);
        request.setPaymentDate(LocalDate.now());
        return recordPrincipalReceived(id, request, user);
    }
    
    // Get payment history for a loan
    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getPaymentHistory(Long loanId, User user) {
        getLoanById(loanId, user); // Validate loan exists and belongs to user
        return paymentHistoryRepository.findAllByLoanId(loanId)
                .stream()
                .map(PaymentHistoryResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Get all payment history for user
    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getAllPaymentHistory(User user) {
        List<Loan> userLoans = loanRepository.findByUser(user);
        List<Long> loanIds = userLoans.stream().map(Loan::getId).collect(Collectors.toList());
        
        return paymentHistoryRepository.findAll()
                .stream()
                .filter(ph -> loanIds.contains(ph.getLoan().getId()))
                .sorted((a, b) -> b.getPaymentDate().compareTo(a.getPaymentDate()))
                .map(PaymentHistoryResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    // Interest Calculator
    @Transactional(readOnly = true)
    public InterestCalculation calculateInterest(BigDecimal principal, Double interestRate, 
            String frequency, Integer days) {
        
        // Convert days to months (assuming 30 days per month)
        Integer durationMonths = (days != null && days > 0) ? (int) Math.ceil(days / 30.0) : 12;
        
        double annualRate = interestRate / 100.0;
        BigDecimal yearlyInterest = principal.multiply(BigDecimal.valueOf(annualRate));
        BigDecimal monthlyInterest = yearlyInterest.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        BigDecimal dailyInterest = yearlyInterest.divide(BigDecimal.valueOf(365), 2, RoundingMode.HALF_UP);
        BigDecimal weeklyInterest = yearlyInterest.divide(BigDecimal.valueOf(52), 2, RoundingMode.HALF_UP);
        
        BigDecimal perPaymentInterest = switch (frequency.toUpperCase()) {
            case "DAILY" -> dailyInterest;
            case "WEEKLY" -> weeklyInterest;
            case "BIWEEKLY" -> weeklyInterest.multiply(BigDecimal.valueOf(2));
            case "MONTHLY" -> monthlyInterest;
            case "QUARTERLY" -> monthlyInterest.multiply(BigDecimal.valueOf(3));
            case "YEARLY" -> yearlyInterest;
            default -> monthlyInterest;
        };
        
        BigDecimal totalInterest = monthlyInterest.multiply(BigDecimal.valueOf(durationMonths));
        BigDecimal totalAmount = principal.add(totalInterest);
        
        return InterestCalculation.builder()
                .principal(principal)
                .interestRate(interestRate)
                .frequency(frequency)
                .durationMonths(durationMonths)
                .dailyInterest(dailyInterest.setScale(2, RoundingMode.HALF_UP))
                .weeklyInterest(weeklyInterest.setScale(2, RoundingMode.HALF_UP))
                .monthlyInterest(monthlyInterest.setScale(2, RoundingMode.HALF_UP))
                .yearlyInterest(yearlyInterest.setScale(2, RoundingMode.HALF_UP))
                .perPaymentInterest(perPaymentInterest.setScale(2, RoundingMode.HALF_UP))
                .totalInterest(totalInterest.setScale(2, RoundingMode.HALF_UP))
                .totalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP))
                .build();
    }
}
