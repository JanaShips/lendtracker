-- ============================================
-- LendTracker MySQL Schema
-- ============================================
-- Run this script to create the database manually
-- Or let Hibernate auto-create with ddl-auto=update

-- Create Database
CREATE DATABASE IF NOT EXISTS lendtracker
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE lendtracker;

-- ============================================
-- Table: loans
-- ============================================
-- Stores all loans you have given out
CREATE TABLE IF NOT EXISTS loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Borrower Information
    borrower_name VARCHAR(255) NOT NULL COMMENT 'Name of person who borrowed money',
    borrower_phone VARCHAR(50) COMMENT 'Contact phone number',
    borrower_email VARCHAR(255) COMMENT 'Contact email address',
    
    -- Loan Details
    principal_amount DECIMAL(15, 2) NOT NULL COMMENT 'Amount lent in INR',
    interest_rate DOUBLE NOT NULL COMMENT 'Annual interest rate in percentage (0-100)',
    lend_date DATE NOT NULL COMMENT 'Date when loan was given',
    due_date DATE COMMENT 'Expected repayment date',
    interest_frequency ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY') 
        NOT NULL DEFAULT 'MONTHLY' COMMENT 'How often interest is collected',
    
    -- Payment Tracking
    total_interest_received DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Total interest received so far',
    total_principal_received DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Total principal returned so far',
    
    -- Additional Info
    notes TEXT COMMENT 'Additional notes about the loan',
    status ENUM('ACTIVE', 'CLOSED', 'DEFAULTED') NOT NULL DEFAULT 'ACTIVE' 
        COMMENT 'Current status of the loan',
    
    -- Audit Fields
    created_at DATE COMMENT 'Record creation date',
    updated_at DATE COMMENT 'Last update date',
    
    -- Indexes
    INDEX idx_status (status),
    INDEX idx_borrower_name (borrower_name),
    INDEX idx_lend_date (lend_date),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks all loans given out by the user';

-- ============================================
-- Table: payment_history
-- ============================================
-- Tracks all payments received from borrowers
CREATE TABLE IF NOT EXISTS payment_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Reference to Loan
    loan_id BIGINT NOT NULL COMMENT 'Reference to the loan',
    
    -- Payment Details
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Payment amount in INR',
    payment_type ENUM('INTEREST', 'PRINCIPAL') NOT NULL COMMENT 'Type of payment',
    payment_date DATE NOT NULL COMMENT 'Date payment was received',
    notes TEXT COMMENT 'Payment notes',
    
    -- Audit Fields
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    
    -- Foreign Key
    CONSTRAINT fk_payment_loan FOREIGN KEY (loan_id) 
        REFERENCES loans(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_loan_id (loan_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_type (payment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks all payments received from borrowers';

-- ============================================
-- Sample Data (Optional)
-- ============================================
-- Uncomment to insert sample data for testing

/*
-- Sample Loans
INSERT INTO loans (borrower_name, borrower_phone, borrower_email, principal_amount, interest_rate, lend_date, due_date, interest_frequency, total_interest_received, total_principal_received, notes, status, created_at, updated_at) VALUES
('Rajesh Sharma', '+91 9876543210', 'rajesh.sharma@gmail.com', 500000.00, 12.0, '2024-06-03', '2025-12-03', 'MONTHLY', 30000.00, 0.00, 'Business expansion loan', 'ACTIVE', CURDATE(), CURDATE()),
('Priya Reddy', '+91 8765432109', 'priya.reddy@outlook.com', 200000.00, 10.0, '2024-09-03', '2025-09-03', 'QUARTERLY', 5000.00, 20000.00, 'Education loan for daughter', 'ACTIVE', CURDATE(), CURDATE()),
('Amit Patel', '+91 7654321098', NULL, 100000.00, 18.0, '2023-12-03', '2024-11-03', 'MONTHLY', 18000.00, 100000.00, 'Emergency medical expenses - fully repaid', 'CLOSED', CURDATE(), CURDATE()),
('Suresh Kumar', '+91 6543210987', 'suresh.k@yahoo.com', 75000.00, 15.0, '2024-10-03', '2025-08-03', 'BIWEEKLY', 1875.00, 0.00, 'Home renovation', 'ACTIVE', CURDATE(), CURDATE());

-- Sample Payment History
INSERT INTO payment_history (loan_id, amount, payment_type, payment_date, notes) VALUES
(1, 5000.00, 'INTEREST', '2024-12-01', 'December interest'),
(1, 5000.00, 'INTEREST', '2024-11-01', 'November interest'),
(1, 5000.00, 'INTEREST', '2024-10-01', 'October interest'),
(1, 5000.00, 'INTEREST', '2024-09-01', 'September interest'),
(1, 5000.00, 'INTEREST', '2024-08-01', 'August interest'),
(1, 5000.00, 'INTEREST', '2024-07-01', 'July interest'),
(2, 5000.00, 'INTEREST', '2024-11-15', 'Q4 interest payment'),
(2, 20000.00, 'PRINCIPAL', '2024-11-15', 'Partial principal repayment'),
(3, 100000.00, 'PRINCIPAL', '2024-10-15', 'Full principal repayment'),
(3, 18000.00, 'INTEREST', '2024-10-15', 'Final interest settlement'),
(4, 1875.00, 'INTEREST', '2024-11-15', 'Bi-weekly interest');
*/

-- ============================================
-- Useful Queries
-- ============================================

-- View all active loans with outstanding amount
/*
SELECT 
    id,
    borrower_name,
    principal_amount,
    interest_rate,
    interest_frequency,
    total_interest_received,
    total_principal_received,
    (principal_amount - total_principal_received) AS outstanding_principal,
    status
FROM loans
WHERE status = 'ACTIVE'
ORDER BY principal_amount DESC;
*/

-- View payment history for a specific loan
/*
SELECT 
    ph.id,
    l.borrower_name,
    ph.amount,
    ph.payment_type,
    ph.payment_date,
    ph.notes
FROM payment_history ph
JOIN loans l ON ph.loan_id = l.id
WHERE l.id = 1
ORDER BY ph.payment_date DESC;
*/

-- Dashboard summary
/*
SELECT 
    COUNT(*) AS total_loans,
    SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_loans,
    SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) AS closed_loans,
    SUM(CASE WHEN status = 'ACTIVE' THEN principal_amount ELSE 0 END) AS total_lent_out,
    SUM(total_interest_received) AS total_interest_collected,
    SUM(total_principal_received) AS total_principal_returned,
    AVG(CASE WHEN status = 'ACTIVE' THEN interest_rate END) AS avg_interest_rate
FROM loans;
*/
