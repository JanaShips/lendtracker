package com.lendtracker.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.lendtracker.entity.Loan;
import com.lendtracker.exception.GlobalExceptionHandler;
import com.lendtracker.exception.LoanNotFoundException;
import com.lendtracker.service.LoanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LoanController.class)
class LoanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LoanService loanService;

    private ObjectMapper objectMapper;
    private Loan testLoan;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        testLoan = Loan.builder()
                .id(1L)
                .borrowerName("Test Borrower")
                .principalAmount(new BigDecimal("10000.00"))
                .interestRate(5.0)
                .lendDate(LocalDate.now())
                .dueDate(LocalDate.now().plusMonths(6))
                .interestFrequency(Loan.InterestFrequency.MONTHLY)
                .status(Loan.LoanStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("POST /api/loans - Should create loan and return 201")
    void createLoan_Success() throws Exception {
        when(loanService.createLoan(any(Loan.class))).thenReturn(testLoan);

        mockMvc.perform(post("/api/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLoan)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.borrowerName").value("Test Borrower"));
    }

    @Test
    @DisplayName("POST /api/loans - Should return 400 for invalid data")
    void createLoan_ValidationError() throws Exception {
        Loan invalidLoan = Loan.builder()
                .borrowerName("")
                .principalAmount(new BigDecimal("-100"))
                .interestRate(-1.0)
                .lendDate(LocalDate.now())
                .dueDate(LocalDate.now())
                .interestFrequency(Loan.InterestFrequency.MONTHLY)
                .status(Loan.LoanStatus.ACTIVE)
                .build();

        mockMvc.perform(post("/api/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidLoan)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/loans - Should return all loans")
    void getAllLoans_Success() throws Exception {
        List<Loan> loans = Arrays.asList(testLoan);
        when(loanService.getAllLoans()).thenReturn(loans);

        mockMvc.perform(get("/api/loans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].borrowerName").value("Test Borrower"));
    }

    @Test
    @DisplayName("GET /api/loans/{id} - Should return loan by ID")
    void getLoanById_Success() throws Exception {
        when(loanService.getLoanById(1L)).thenReturn(testLoan);

        mockMvc.perform(get("/api/loans/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.borrowerName").value("Test Borrower"));
    }

    @Test
    @DisplayName("GET /api/loans/{id} - Should return 404 when loan not found")
    void getLoanById_NotFound() throws Exception {
        when(loanService.getLoanById(99L)).thenThrow(new LoanNotFoundException(99L));

        mockMvc.perform(get("/api/loans/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Loan not found with id: 99"));
    }

    @Test
    @DisplayName("PUT /api/loans/{id} - Should update loan")
    void updateLoan_Success() throws Exception {
        when(loanService.updateLoan(eq(1L), any(Loan.class))).thenReturn(testLoan);

        mockMvc.perform(put("/api/loans/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLoan)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.borrowerName").value("Test Borrower"));
    }

    @Test
    @DisplayName("DELETE /api/loans/{id} - Should delete loan and return 204")
    void deleteLoan_Success() throws Exception {
        doNothing().when(loanService).deleteLoan(1L);

        mockMvc.perform(delete("/api/loans/1"))
                .andExpect(status().isNoContent());

        verify(loanService, times(1)).deleteLoan(1L);
    }
}
