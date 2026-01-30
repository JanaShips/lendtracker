package com.lendtracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User who owns this loan
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // Person who borrowed money FROM you
    @NotBlank(message = "Borrower name is required")
    @Column(nullable = false)
    private String borrowerName;

    @Column
    private String borrowerPhone;

    @Column
    private String borrowerEmail;

    // Amount you lent to them
    @NotNull(message = "Principal amount is required")
    @DecimalMin(value = "0.01", message = "Principal must be greater than 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principalAmount;

    @NotNull(message = "Interest rate is required")
    @Min(value = 0, message = "Interest rate must be >= 0")
    @Max(value = 100, message = "Interest rate must be <= 100")
    @Column(nullable = false)
    private Double interestRate;

    // Date you lent the money
    @NotNull(message = "Lend date is required")
    @Column(nullable = false)
    private LocalDate lendDate;

    @Column
    private LocalDate dueDate;

    @NotNull(message = "Interest pay frequency is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InterestFrequency interestFrequency = InterestFrequency.MONTHLY;

    // Interest received back from borrower
    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalInterestReceived = BigDecimal.ZERO;

    // Principal received back from borrower
    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalPrincipalReceived = BigDecimal.ZERO;

    @Column
    private String notes;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LoanStatus status = LoanStatus.ACTIVE;

    @Column(updatable = false)
    private LocalDate createdAt;

    @Column
    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        updatedAt = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }

    public enum InterestFrequency {
        DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
    }

    public enum LoanStatus {
        ACTIVE, CLOSED, DEFAULTED
    }
}




