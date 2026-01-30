package com.lendtracker.controller;

import com.lendtracker.dto.PaymentHistoryResponse;
import com.lendtracker.dto.PaymentRequest;
import com.lendtracker.entity.Loan;
import com.lendtracker.entity.User;
import com.lendtracker.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<Loan> createLoan(@Valid @RequestBody Loan loan,
                                           @AuthenticationPrincipal User user) {
        Loan createdLoan = loanService.createLoan(loan, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLoan);
    }

    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans(@AuthenticationPrincipal User user) {
        List<Loan> loans = loanService.getAllLoans(user);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Loan>> searchLoans(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String frequency,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Double maxRate,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        java.time.LocalDate from = fromDate != null && !fromDate.isEmpty() 
            ? java.time.LocalDate.parse(fromDate) : null;
        java.time.LocalDate to = toDate != null && !toDate.isEmpty() 
            ? java.time.LocalDate.parse(toDate) : null;
            
        List<Loan> loans = loanService.searchAndFilterLoans(
            user, q, status, frequency, minAmount, maxAmount, minRate, maxRate, from, to
        );
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/filter-counts")
    public ResponseEntity<Map<String, Object>> getFilterCounts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.getFilterCounts(user));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Loan>> getActiveLoans(@AuthenticationPrincipal User user) {
        List<Loan> loans = loanService.getActiveLoans(user);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id,
                                            @AuthenticationPrincipal User user) {
        Loan loan = loanService.getLoanById(id, user);
        return ResponseEntity.ok(loan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Loan> updateLoan(@PathVariable Long id, 
                                           @Valid @RequestBody Loan loan,
                                           @AuthenticationPrincipal User user) {
        Loan updatedLoan = loanService.updateLoan(id, loan, user);
        return ResponseEntity.ok(updatedLoan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id,
                                           @AuthenticationPrincipal User user) {
        loanService.deleteLoan(id, user);
        return ResponseEntity.noContent().build();
    }

    // Dashboard endpoint
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal User user) {
        Map<String, Object> stats = loanService.getDashboardStats(user);
        return ResponseEntity.ok(stats);
    }

    // Record payments received from borrowers with history
    @PostMapping("/{id}/receive-interest")
    public ResponseEntity<Loan> receiveInterest(@PathVariable Long id,
                                                @RequestBody PaymentRequest request,
                                                @AuthenticationPrincipal User user) {
        Loan loan = loanService.recordInterestReceived(id, request, user);
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/{id}/receive-principal")
    public ResponseEntity<Loan> receivePrincipal(@PathVariable Long id,
                                                 @RequestBody PaymentRequest request,
                                                 @AuthenticationPrincipal User user) {
        Loan loan = loanService.recordPrincipalReceived(id, request, user);
        return ResponseEntity.ok(loan);
    }
    
    // Payment history endpoints
    @GetMapping("/{id}/payment-history")
    public ResponseEntity<List<PaymentHistoryResponse>> getPaymentHistory(@PathVariable Long id,
                                                                          @AuthenticationPrincipal User user) {
        List<PaymentHistoryResponse> history = loanService.getPaymentHistory(id, user);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/payment-history/all")
    public ResponseEntity<List<PaymentHistoryResponse>> getAllPaymentHistory(@AuthenticationPrincipal User user) {
        List<PaymentHistoryResponse> history = loanService.getAllPaymentHistory(user);
        return ResponseEntity.ok(history);
    }
    
    // Interest calculator (no authentication required - public utility)
    @GetMapping("/calculate-interest")
    public ResponseEntity<?> calculateInterest(@RequestParam BigDecimal principal,
                                               @RequestParam Double interestRate,
                                               @RequestParam String frequency,
                                               @RequestParam Integer days) {
        return ResponseEntity.ok(loanService.calculateInterest(principal, interestRate, frequency, days));
    }
}
