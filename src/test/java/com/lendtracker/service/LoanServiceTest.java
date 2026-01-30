package com.lendtracker.service;

import com.lendtracker.entity.Loan;
import com.lendtracker.entity.User;
import com.lendtracker.exception.LoanNotFoundException;
import com.lendtracker.repository.LoanRepository;
import com.lendtracker.repository.PaymentHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanServiceTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private PaymentHistoryRepository paymentHistoryRepository;

    @InjectMocks
    private LoanService loanService;

    private Loan testLoan;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("password")
                .build();

        testLoan = Loan.builder()
                .id(1L)
                .borrowerName("Test Borrower")
                .principalAmount(new BigDecimal("10000.00"))
                .interestRate(5.0)
                .lendDate(LocalDate.now())
                .dueDate(LocalDate.now().plusMonths(6))
                .interestFrequency(Loan.InterestFrequency.MONTHLY)
                .status(Loan.LoanStatus.ACTIVE)
                .user(testUser)
                .build();
    }

    @Test
    @DisplayName("Should create loan successfully")
    void createLoan_Success() {
        when(loanRepository.save(any(Loan.class))).thenReturn(testLoan);

        Loan created = loanService.createLoan(testLoan, testUser);

        assertThat(created).isNotNull();
        assertThat(created.getBorrowerName()).isEqualTo("Test Borrower");
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    @DisplayName("Should return all loans for user")
    void getAllLoans_Success() {
        List<Loan> loans = Arrays.asList(testLoan, testLoan);
        when(loanRepository.findByUserOrderByCreatedAtDesc(testUser)).thenReturn(loans);

        List<Loan> result = loanService.getAllLoans(testUser);

        assertThat(result).hasSize(2);
        verify(loanRepository, times(1)).findByUserOrderByCreatedAtDesc(testUser);
    }

    @Test
    @DisplayName("Should return loan by ID for user")
    void getLoanById_Success() {
        when(loanRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testLoan));

        Loan result = loanService.getLoanById(1L, testUser);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should throw exception when loan not found for user")
    void getLoanById_NotFound() {
        when(loanRepository.findByIdAndUser(99L, testUser)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanService.getLoanById(99L, testUser))
                .isInstanceOf(LoanNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("Should update loan successfully")
    void updateLoan_Success() {
        Loan updatedDetails = Loan.builder()
                .borrowerName("Updated Name")
                .principalAmount(new BigDecimal("15000.00"))
                .interestRate(6.0)
                .lendDate(LocalDate.now())
                .dueDate(LocalDate.now().plusMonths(12))
                .interestFrequency(Loan.InterestFrequency.MONTHLY)
                .status(Loan.LoanStatus.ACTIVE)
                .build();

        when(loanRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(testLoan);

        Loan result = loanService.updateLoan(1L, updatedDetails, testUser);

        assertThat(result).isNotNull();
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    @DisplayName("Should delete loan successfully")
    void deleteLoan_Success() {
        when(loanRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testLoan));
        doNothing().when(paymentHistoryRepository).deleteByLoanId(1L);
        doNothing().when(loanRepository).delete(testLoan);

        loanService.deleteLoan(1L, testUser);

        verify(loanRepository, times(1)).delete(testLoan);
    }
}
