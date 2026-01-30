package com.lendtracker.repository;

import com.lendtracker.entity.Loan;
import com.lendtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    
    // User-specific queries
    List<Loan> findByUser(User user);
    
    List<Loan> findByUserOrderByCreatedAtDesc(User user);
    
    List<Loan> findByUserAndStatus(User user, Loan.LoanStatus status);
    
    Optional<Loan> findByIdAndUser(Long id, User user);
    
    // Search and filter queries
    @Query("SELECT l FROM Loan l WHERE l.user = :user " +
           "AND (:search IS NULL OR LOWER(l.borrowerName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR LOWER(l.borrowerEmail) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR LOWER(l.borrowerPhone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR l.status = :status) " +
           "AND (:frequency IS NULL OR l.interestFrequency = :frequency) " +
           "AND (:minAmount IS NULL OR l.principalAmount >= :minAmount) " +
           "AND (:maxAmount IS NULL OR l.principalAmount <= :maxAmount) " +
           "AND (:minRate IS NULL OR l.interestRate >= :minRate) " +
           "AND (:maxRate IS NULL OR l.interestRate <= :maxRate) " +
           "AND (:fromDate IS NULL OR l.lendDate >= :fromDate) " +
           "AND (:toDate IS NULL OR l.lendDate <= :toDate) " +
           "ORDER BY l.createdAt DESC")
    List<Loan> searchAndFilter(
        @Param("user") User user,
        @Param("search") String search,
        @Param("status") Loan.LoanStatus status,
        @Param("frequency") Loan.InterestFrequency frequency,
        @Param("minAmount") BigDecimal minAmount,
        @Param("maxAmount") BigDecimal maxAmount,
        @Param("minRate") Double minRate,
        @Param("maxRate") Double maxRate,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );
    
    // Count queries for filters
    long countByUserAndStatus(User user, Loan.LoanStatus status);
    
    long countByUserAndInterestFrequency(User user, Loan.InterestFrequency frequency);
    
    // Legacy queries (for admin or system use)
    List<Loan> findByStatus(Loan.LoanStatus status);
    
    List<Loan> findByBorrowerNameContainingIgnoreCase(String borrowerName);
    
    List<Loan> findByInterestFrequency(Loan.InterestFrequency frequency);
}




