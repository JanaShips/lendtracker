package com.lendtracker.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class InterestCalculation {
    private BigDecimal principal;
    private Double interestRate;
    private String frequency;
    private Integer durationMonths;
    
    private BigDecimal monthlyInterest;
    private BigDecimal yearlyInterest;
    private BigDecimal totalInterest;
    private BigDecimal totalAmount;
    
    private BigDecimal dailyInterest;
    private BigDecimal weeklyInterest;
    private BigDecimal perPaymentInterest;
}













