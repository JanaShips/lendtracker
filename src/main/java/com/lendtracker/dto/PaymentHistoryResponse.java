package com.lendtracker.dto;

import com.lendtracker.entity.PaymentHistory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentHistoryResponse {
    private Long id;
    private Long loanId;
    private String borrowerName;
    private BigDecimal amount;
    private String paymentType;
    private LocalDate paymentDate;
    private String notes;
    private LocalDateTime createdAt;

    public static PaymentHistoryResponse fromEntity(PaymentHistory payment) {
        return PaymentHistoryResponse.builder()
                .id(payment.getId())
                .loanId(payment.getLoan().getId())
                .borrowerName(payment.getLoan().getBorrowerName())
                .amount(payment.getAmount())
                .paymentType(payment.getPaymentType().toString())
                .paymentDate(payment.getPaymentDate())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}













