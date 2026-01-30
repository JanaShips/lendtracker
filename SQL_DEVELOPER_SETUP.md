# Connecting SQL Developer to LendTracker Database

## 📋 Prerequisites

1. Oracle SQL Developer installed
2. H2 Database JDBC Driver

## 🔧 Step 1: Download H2 JDBC Driver

1. Go to: https://h2database.com/html/download.html
2. Download the "Platform-Independent Zip" (h2-*.zip)
3. Extract and locate: `h2/bin/h2-*.jar`

## 🔧 Step 2: Add H2 Driver to SQL Developer

1. Open SQL Developer
2. Go to **Tools** → **Preferences**
3. Navigate to **Database** → **Third Party JDBC Drivers**
4. Click **Add Entry**
5. Browse and select the `h2-*.jar` file
6. Click **OK**

## 🔧 Step 3: Create Connection

1. Click **+** (New Connection) or **File** → **New** → **Database Connection**
2. Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | LendTracker |
| **Username** | sa |
| **Password** | lendtracker123 |
| **Connection Type** | Advanced |
| **Custom JDBC URL** | (see below) |

### JDBC URL:
```
jdbc:h2:file:C:/Users/janardko/lendtracker-data/lendtracker;AUTO_SERVER=TRUE
```

> ⚠️ **Important:** Replace `janardko` with your Windows username if different.

## 🔧 Step 4: Test Connection

1. Click **Test** button
2. You should see "Status: Success"
3. Click **Connect**

## 📊 Tables Available

After connecting, you'll see these tables under **Tables**:

| Table | Description |
|-------|-------------|
| `LOANS` | All loan records |
| `PAYMENT_HISTORY` | All payment transactions |

## 🔍 Sample Queries

### View All Loans
```sql
SELECT * FROM LOANS ORDER BY ID;
```

### View Active Loans with Outstanding
```sql
SELECT 
    ID,
    BORROWER_NAME,
    PRINCIPAL_AMOUNT,
    INTEREST_RATE,
    TOTAL_PRINCIPAL_RECEIVED,
    (PRINCIPAL_AMOUNT - TOTAL_PRINCIPAL_RECEIVED) AS OUTSTANDING,
    STATUS
FROM LOANS
WHERE STATUS = 'ACTIVE'
ORDER BY PRINCIPAL_AMOUNT DESC;
```

### View Payment History
```sql
SELECT 
    ph.ID,
    l.BORROWER_NAME,
    ph.AMOUNT,
    ph.PAYMENT_TYPE,
    ph.PAYMENT_DATE,
    ph.NOTES
FROM PAYMENT_HISTORY ph
JOIN LOANS l ON ph.LOAN_ID = l.ID
ORDER BY ph.PAYMENT_DATE DESC;
```

### Dashboard Summary
```sql
SELECT 
    COUNT(*) AS TOTAL_LOANS,
    SUM(CASE WHEN STATUS = 'ACTIVE' THEN 1 ELSE 0 END) AS ACTIVE_LOANS,
    SUM(CASE WHEN STATUS = 'CLOSED' THEN 1 ELSE 0 END) AS CLOSED_LOANS,
    SUM(CASE WHEN STATUS = 'ACTIVE' THEN PRINCIPAL_AMOUNT ELSE 0 END) AS TOTAL_LENT_OUT,
    SUM(TOTAL_INTEREST_RECEIVED) AS TOTAL_INTEREST_COLLECTED,
    SUM(TOTAL_PRINCIPAL_RECEIVED) AS TOTAL_PRINCIPAL_RETURNED
FROM LOANS;
```

### Calculate Monthly Interest Expected
```sql
SELECT 
    BORROWER_NAME,
    PRINCIPAL_AMOUNT,
    INTEREST_RATE,
    INTEREST_FREQUENCY,
    CASE INTEREST_FREQUENCY
        WHEN 'MONTHLY' THEN PRINCIPAL_AMOUNT * (INTEREST_RATE / 100) / 12
        WHEN 'QUARTERLY' THEN PRINCIPAL_AMOUNT * (INTEREST_RATE / 100) / 4 / 3
        WHEN 'YEARLY' THEN PRINCIPAL_AMOUNT * (INTEREST_RATE / 100) / 12
        WHEN 'WEEKLY' THEN PRINCIPAL_AMOUNT * (INTEREST_RATE / 100) / 52 * 4.33
        WHEN 'DAILY' THEN PRINCIPAL_AMOUNT * (INTEREST_RATE / 100) / 365 * 30
        WHEN 'BIWEEKLY' THEN PRINCIPAL_AMOUNT * (INTEREST_RATE / 100) / 26 * 2.17
    END AS MONTHLY_INTEREST
FROM LOANS
WHERE STATUS = 'ACTIVE';
```

## ⚠️ Troubleshooting

### "Database may be already in use"
- Make sure the Spring Boot application is NOT running
- Or use `AUTO_SERVER=TRUE` in the JDBC URL (already included)

### "File not found"
- Start the Spring Boot app at least once to create the database file
- Check the path: `C:\Users\<username>\lendtracker-data\`

### Connection Refused
- Start the LendTracker backend first
- The database file is created on first startup

## 🔄 Auto-Server Mode

The database is configured with `AUTO_SERVER=TRUE`, which means:
- Multiple connections are allowed
- SQL Developer can connect while the app is running
- No need to stop the backend to use SQL Developer

---

## 📁 Database File Location

```
C:\Users\janardko\lendtracker-data\
├── lendtracker.mv.db      (main database file)
└── lendtracker.trace.db   (optional trace log)
```
