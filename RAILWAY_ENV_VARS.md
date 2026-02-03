# Railway Environment Variables Setup Guide

## Required Environment Variables for LendTracker Backend

Add these in Railway Dashboard → Your Service → Variables tab

### 1. Spring Profile (REQUIRED)
```
SPRING_PROFILES_ACTIVE=mysql
```

### 2. Database Variables (Auto-set by Railway when MySQL is linked)
These are automatically set when you link a MySQL database to your service.
If not set, add them manually:
```
MYSQLHOST=<your-mysql-host>
MYSQLPORT=3306
MYSQLDATABASE=<your-database-name>
MYSQLUSER=<your-mysql-user>
MYSQLPASSWORD=<your-mysql-password>
```

**Note:** Railway automatically sets these when you link a MySQL database. Just make sure your MySQL service is linked to your backend service.

### 3. JWT Secret (REQUIRED - Generate a new one!)
```
JWT_SECRET=<generate-a-random-256-bit-secret>
```
**How to generate:**
- Use: https://generate-secret.vercel.app/32 (or any random string generator)
- Or run: `openssl rand -base64 32`
- Make it at least 32 characters long

### 4. Email Configuration (REQUIRED for OTP)
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=jana.amcle@gmail.com
MAIL_PASSWORD=<your-gmail-app-password>
```

**To get Gmail App Password:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification (if not already enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Generate a new app password for "Mail"
5. Copy the 16-character password (no spaces)

### 5. Application URL (REQUIRED)
```
APP_BASE_URL=https://lendtracker.vercel.app
```

### 6. Optional Variables
```
LOG_LEVEL=INFO
SHOW_SQL=false
```

---

## Quick Setup Steps in Railway:

1. **Go to Railway Dashboard** → Your Project → Backend Service

2. **Link MySQL Database:**
   - Click "New" → "Database" → "Add MySQL"
   - Railway will automatically link it and set MYSQL* variables

3. **Add Variables:**
   - Click "Variables" tab
   - Add each variable above (one by one)
   - Click "Add" after each

4. **Redeploy:**
   - Railway will auto-redeploy when you add variables
   - Or click "Deploy" → "Redeploy"

5. **Check Logs:**
   - Go to "Deployments" → Click latest deployment → "View Logs"
   - Look for "Started LendTrackerApplication" to confirm it's running

---

## Verify Deployment:

1. **Health Check:**
   - Visit: `https://your-railway-url.up.railway.app/actuator/health`
   - Should return: `{"status":"UP"}`

2. **Check Public Domain:**
   - Railway → Settings → Generate Domain
   - Your URL will be: `https://your-service-name.up.railway.app`

---

## Troubleshooting:

- **Service keeps crashing:** Check logs for database connection errors
- **Can't connect to database:** Make sure MySQL service is linked
- **Email not working:** Verify MAIL_PASSWORD is correct (16-char app password, not regular password)
- **Health check failing:** Check all required variables are set
