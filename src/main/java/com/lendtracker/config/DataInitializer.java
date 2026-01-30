package com.lendtracker.config;

import com.lendtracker.entity.Loan;
import com.lendtracker.entity.PaymentHistory;
import com.lendtracker.repository.LoanRepository;
import com.lendtracker.repository.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Initializes sample data for development/testing.
 * Only runs with 'dev' or 'mysql' profiles.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    // Disabled - loans now require user authentication
    // @Bean
    // @Profile({"dev", "mysql", "default"})
    CommandLineRunner initDatabase(LoanRepository loanRepository, 
                                   PaymentHistoryRepository paymentHistoryRepository) {
        return args -> {
            // Only initialize if database is empty
            if (loanRepository.count() > 0) {
                log.info("Database already has data. Skipping initialization.");
                return;
            }

            log.info("🚀 Initializing sample data for LendTracker...");

            // ========================================
            // Loan 1: Rajesh Sharma - Business Loan
            // ========================================
            Loan loan1 = Loan.builder()
                    .borrowerName("Rajesh Sharma")
                    .borrowerPhone("+91 9876543210")
                    .borrowerEmail("rajesh.sharma@gmail.com")
                    .principalAmount(new BigDecimal("500000.00"))
                    .interestRate(12.0)
                    .lendDate(LocalDate.of(2024, 6, 3))
                    .dueDate(LocalDate.of(2025, 12, 3))
                    .interestFrequency(Loan.InterestFrequency.MONTHLY)
                    .totalInterestReceived(new BigDecimal("30000.00"))
                    .totalPrincipalReceived(BigDecimal.ZERO)
                    .notes("Business expansion loan for hardware shop")
                    .status(Loan.LoanStatus.ACTIVE)
                    .build();
            loan1 = loanRepository.save(loan1);

            // Payment history for Loan 1
            for (int month = 7; month <= 12; month++) {
                paymentHistoryRepository.save(PaymentHistory.builder()
                        .loan(loan1)
                        .amount(new BigDecimal("5000.00"))
                        .paymentType(PaymentHistory.PaymentType.INTEREST)
                        .paymentDate(LocalDate.of(2024, month, 1))
                        .notes(getMonthName(month) + " interest payment")
                        .build());
            }

            // ========================================
            // Loan 2: Priya Reddy - Education Loan
            // ========================================
            Loan loan2 = Loan.builder()
                    .borrowerName("Priya Reddy")
                    .borrowerPhone("+91 8765432109")
                    .borrowerEmail("priya.reddy@outlook.com")
                    .principalAmount(new BigDecimal("200000.00"))
                    .interestRate(10.0)
                    .lendDate(LocalDate.of(2024, 9, 3))
                    .dueDate(LocalDate.of(2025, 9, 3))
                    .interestFrequency(Loan.InterestFrequency.QUARTERLY)
                    .totalInterestReceived(new BigDecimal("5000.00"))
                    .totalPrincipalReceived(new BigDecimal("20000.00"))
                    .notes("Education loan for daughter's MBA")
                    .status(Loan.LoanStatus.ACTIVE)
                    .build();
            loan2 = loanRepository.save(loan2);

            // Payment history for Loan 2
            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan2)
                    .amount(new BigDecimal("5000.00"))
                    .paymentType(PaymentHistory.PaymentType.INTEREST)
                    .paymentDate(LocalDate.of(2024, 11, 15))
                    .notes("Q4 interest payment")
                    .build());
            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan2)
                    .amount(new BigDecimal("20000.00"))
                    .paymentType(PaymentHistory.PaymentType.PRINCIPAL)
                    .paymentDate(LocalDate.of(2024, 11, 15))
                    .notes("Partial principal repayment")
                    .build());

            // ========================================
            // Loan 3: Amit Patel - Medical Loan (CLOSED)
            // ========================================
            Loan loan3 = Loan.builder()
                    .borrowerName("Amit Patel")
                    .borrowerPhone("+91 7654321098")
                    .borrowerEmail("")
                    .principalAmount(new BigDecimal("100000.00"))
                    .interestRate(18.0)
                    .lendDate(LocalDate.of(2023, 12, 3))
                    .dueDate(LocalDate.of(2024, 11, 3))
                    .interestFrequency(Loan.InterestFrequency.MONTHLY)
                    .totalInterestReceived(new BigDecimal("18000.00"))
                    .totalPrincipalReceived(new BigDecimal("100000.00"))
                    .notes("Emergency medical expenses - FULLY REPAID")
                    .status(Loan.LoanStatus.CLOSED)
                    .build();
            loan3 = loanRepository.save(loan3);

            // Payment history for Loan 3
            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan3)
                    .amount(new BigDecimal("100000.00"))
                    .paymentType(PaymentHistory.PaymentType.PRINCIPAL)
                    .paymentDate(LocalDate.of(2024, 10, 15))
                    .notes("Full principal repayment")
                    .build());
            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan3)
                    .amount(new BigDecimal("18000.00"))
                    .paymentType(PaymentHistory.PaymentType.INTEREST)
                    .paymentDate(LocalDate.of(2024, 10, 15))
                    .notes("Final interest settlement")
                    .build());

            // ========================================
            // Loan 4: Suresh Kumar - Home Renovation
            // ========================================
            Loan loan4 = Loan.builder()
                    .borrowerName("Suresh Kumar")
                    .borrowerPhone("+91 6543210987")
                    .borrowerEmail("suresh.k@yahoo.com")
                    .principalAmount(new BigDecimal("75000.00"))
                    .interestRate(15.0)
                    .lendDate(LocalDate.of(2024, 10, 3))
                    .dueDate(LocalDate.of(2025, 8, 3))
                    .interestFrequency(Loan.InterestFrequency.BIWEEKLY)
                    .totalInterestReceived(new BigDecimal("1875.00"))
                    .totalPrincipalReceived(BigDecimal.ZERO)
                    .notes("Home renovation - kitchen remodeling")
                    .status(Loan.LoanStatus.ACTIVE)
                    .build();
            loan4 = loanRepository.save(loan4);

            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan4)
                    .amount(new BigDecimal("937.50"))
                    .paymentType(PaymentHistory.PaymentType.INTEREST)
                    .paymentDate(LocalDate.of(2024, 10, 17))
                    .notes("First bi-weekly interest")
                    .build());
            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan4)
                    .amount(new BigDecimal("937.50"))
                    .paymentType(PaymentHistory.PaymentType.INTEREST)
                    .paymentDate(LocalDate.of(2024, 11, 1))
                    .notes("Second bi-weekly interest")
                    .build());

            // ========================================
            // Loan 5: Meena Devi - Small Business
            // ========================================
            Loan loan5 = Loan.builder()
                    .borrowerName("Meena Devi")
                    .borrowerPhone("+91 5432109876")
                    .borrowerEmail("")
                    .principalAmount(new BigDecimal("50000.00"))
                    .interestRate(24.0)
                    .lendDate(LocalDate.of(2024, 11, 1))
                    .dueDate(LocalDate.of(2025, 5, 1))
                    .interestFrequency(Loan.InterestFrequency.WEEKLY)
                    .totalInterestReceived(new BigDecimal("2000.00"))
                    .totalPrincipalReceived(BigDecimal.ZERO)
                    .notes("Small kirana shop stock purchase")
                    .status(Loan.LoanStatus.ACTIVE)
                    .build();
            loan5 = loanRepository.save(loan5);

            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan5)
                    .amount(new BigDecimal("250.00"))
                    .paymentType(PaymentHistory.PaymentType.INTEREST)
                    .paymentDate(LocalDate.of(2024, 11, 8))
                    .notes("Week 1 interest")
                    .build());
            paymentHistoryRepository.save(PaymentHistory.builder()
                    .loan(loan5)
                    .amount(new BigDecimal("250.00"))
                    .paymentType(PaymentHistory.PaymentType.INTEREST)
                    .paymentDate(LocalDate.of(2024, 11, 15))
                    .notes("Week 2 interest")
                    .build());

            log.info("✅ Sample data initialized successfully!");
            log.info("   - {} loans created", loanRepository.count());
            log.info("   - {} payment records created", paymentHistoryRepository.count());
        };
    }

    private String getMonthName(int month) {
        return switch (month) {
            case 1 -> "January";
            case 2 -> "February";
            case 3 -> "March";
            case 4 -> "April";
            case 5 -> "May";
            case 6 -> "June";
            case 7 -> "July";
            case 8 -> "August";
            case 9 -> "September";
            case 10 -> "October";
            case 11 -> "November";
            case 12 -> "December";
            default -> "Month " + month;
        };
    }
}
