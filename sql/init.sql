-- ============================================
-- LendTracker - MySQL Initialization Script
-- ============================================
-- This script runs automatically when MySQL container starts
-- ============================================

-- Create database if not exists (already done by MYSQL_DATABASE env var)
-- CREATE DATABASE IF NOT EXISTS lendtracker;

USE lendtracker;

-- Set character set
ALTER DATABASE lendtracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges
GRANT ALL PRIVILEGES ON lendtracker.* TO 'lendtracker'@'%';
FLUSH PRIVILEGES;

-- Note: Tables are created automatically by Hibernate (ddl-auto=update)
-- This script is for any additional initialization if needed

-- ============================================
-- Optional: Create indexes for better performance
-- ============================================
-- These will be created after Hibernate creates the tables
-- You may need to run these manually after first deployment

-- CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
-- CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
-- CREATE INDEX IF NOT EXISTS idx_loans_borrower_name ON loans(borrower_name);
-- CREATE INDEX IF NOT EXISTS idx_payment_history_loan_id ON payment_history(loan_id);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
