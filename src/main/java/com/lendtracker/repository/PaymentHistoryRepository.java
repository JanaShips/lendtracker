package com.lendtracker.repository;

import com.lendtracker.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {

    List<PaymentHistory> findByLoanIdOrderByPaymentDateDesc(Long loanId);

    List<PaymentHistory> findByLoanIdAndPaymentTypeOrderByPaymentDateDesc(
            Long loanId, PaymentHistory.PaymentType paymentType);

    @Query("SELECT ph FROM PaymentHistory ph WHERE ph.loan.id = :loanId ORDER BY ph.paymentDate DESC, ph.createdAt DESC")
    List<PaymentHistory> findAllByLoanId(@Param("loanId") Long loanId);

    void deleteByLoanId(Long loanId);
}













