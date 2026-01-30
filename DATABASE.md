# LendTracker Database Schema

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         LOANS                                │
├─────────────────────────────────────────────────────────────┤
│ PK │ id                    BIGINT AUTO_INCREMENT            │
├────┼────────────────────────────────────────────────────────┤
│    │ borrower_name         VARCHAR(255) NOT NULL            │
│    │ borrower_phone        VARCHAR(255)                     │
│    │ borrower_email        VARCHAR(255)                     │
│    │ principal_amount      DECIMAL(15,2) NOT NULL           │
│    │ interest_rate         DOUBLE NOT NULL                  │
│    │ lend_date             DATE NOT NULL                    │
│    │ due_date              DATE                             │
│    │ interest_frequency    ENUM(...) NOT NULL               │
│    │ total_interest_received  DECIMAL(15,2) DEFAULT 0       │
│    │ total_principal_received DECIMAL(15,2) DEFAULT 0       │
│    │ notes                 TEXT                             │
│    │ status                ENUM(...) NOT NULL               │
│    │ created_at            DATE                             │
│    │ updated_at            DATE                             │
└────┴────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT_HISTORY                           │
├─────────────────────────────────────────────────────────────┤
│ PK │ id                    BIGINT AUTO_INCREMENT            │
├────┼────────────────────────────────────────────────────────┤
│ FK │ loan_id               BIGINT NOT NULL → loans.id       │
│    │ amount                DECIMAL(15,2) NOT NULL           │
│    │ payment_type          ENUM('INTEREST','PRINCIPAL')     │
│    │ payment_date          DATE NOT NULL                    │
│    │ notes                 TEXT                             │
│    │ created_at            DATETIME                         │
└────┴────────────────────────────────────────────────────────┘
```

---

## 📋 Table Details

### 1. LOANS Table

The main table storing all loan records you've given out.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique identifier |
| `borrower_name` | VARCHAR(255) | NOT NULL | Name of person who borrowed |
| `borrower_phone` | VARCHAR(255) | NULLABLE | Contact phone |
| `borrower_email` | VARCHAR(255) | NULLABLE | Contact email |
| `principal_amount` | DECIMAL(15,2) | NOT NULL | Amount you lent (₹) |
| `interest_rate` | DOUBLE | NOT NULL, 0-100 | Annual interest rate (%) |
| `lend_date` | DATE | NOT NULL | When you gave the loan |
| `due_date` | DATE | NULLABLE | Expected repayment date |
| `interest_frequency` | ENUM | NOT NULL | How often interest is paid |
| `total_interest_received` | DECIMAL(15,2) | DEFAULT 0 | Sum of interest received |
| `total_principal_received` | DECIMAL(15,2) | DEFAULT 0 | Sum of principal returned |
| `notes` | TEXT | NULLABLE | Any additional notes |
| `status` | ENUM | NOT NULL | Current loan status |
| `created_at` | DATE | AUTO | Record creation date |
| `updated_at` | DATE | AUTO | Last update date |

**ENUM Values:**
- `interest_frequency`: DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
- `status`: ACTIVE, CLOSED, DEFAULTED

---

### 2. PAYMENT_HISTORY Table

Tracks every payment received from borrowers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique identifier |
| `loan_id` | BIGINT | FK → loans.id, NOT NULL | Reference to loan |
| `amount` | DECIMAL(15,2) | NOT NULL | Payment amount (₹) |
| `payment_type` | ENUM | NOT NULL | Interest or Principal |
| `payment_date` | DATE | NOT NULL | When payment was received |
| `notes` | TEXT | NULLABLE | Payment notes |
| `created_at` | DATETIME | AUTO | Record creation timestamp |

**ENUM Values:**
- `payment_type`: INTEREST, PRINCIPAL

---

## 🔗 Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| Loan → PaymentHistory | One-to-Many | One loan can have many payments |

---

## 📈 Sample Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│ SCENARIO: You lend ₹100,000 to Rajesh at 12% monthly        │
└──────────────────────────────────────────────────────────────┘

1. CREATE LOAN
   INSERT INTO loans (borrower_name, principal_amount, interest_rate, ...)
   → Creates record with id=1, status=ACTIVE
   
2. RECEIVE INTEREST (Monthly ₹1,000)
   INSERT INTO payment_history (loan_id=1, amount=1000, payment_type='INTEREST')
   UPDATE loans SET total_interest_received = total_interest_received + 1000
   
3. RECEIVE PRINCIPAL (Partial ₹20,000)
   INSERT INTO payment_history (loan_id=1, amount=20000, payment_type='PRINCIPAL')
   UPDATE loans SET total_principal_received = total_principal_received + 20000
   
4. FULL REPAYMENT (Remaining ₹80,000)
   INSERT INTO payment_history (loan_id=1, amount=80000, payment_type='PRINCIPAL')
   UPDATE loans SET total_principal_received = 100000, status='CLOSED'
```

---

## 🧮 Key Calculations

### Monthly Interest Expected
```sql
SELECT SUM(
    CASE interest_frequency
        WHEN 'DAILY' THEN principal_amount * (interest_rate / 100) / 365 * 30
        WHEN 'WEEKLY' THEN principal_amount * (interest_rate / 100) / 52 * 4.33
        WHEN 'BIWEEKLY' THEN principal_amount * (interest_rate / 100) / 26 * 2.17
        WHEN 'MONTHLY' THEN principal_amount * (interest_rate / 100) / 12
        WHEN 'QUARTERLY' THEN principal_amount * (interest_rate / 100) / 4 / 3
        WHEN 'YEARLY' THEN principal_amount * (interest_rate / 100) / 12
    END
) AS monthly_interest
FROM loans WHERE status = 'ACTIVE';
```

### Outstanding Amount per Borrower
```sql
SELECT 
    borrower_name,
    SUM(principal_amount - total_principal_received) AS outstanding
FROM loans 
WHERE status = 'ACTIVE'
GROUP BY borrower_name
ORDER BY outstanding DESC;
```

---

## 🔧 Indexes (Auto-created by JPA + Manual recommendations)

```sql
-- Primary Keys (auto)
PRIMARY KEY (id) ON loans
PRIMARY KEY (id) ON payment_history

-- Foreign Keys (auto)
FOREIGN KEY (loan_id) REFERENCES loans(id) ON payment_history

-- Recommended indexes for performance
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_borrower ON loans(borrower_name);
CREATE INDEX idx_payment_loan_id ON payment_history(loan_id);
CREATE INDEX idx_payment_date ON payment_history(payment_date);
```
