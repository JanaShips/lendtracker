# Railway Deployment Troubleshooting

## Common Issues & Solutions

### 1. Deployment Crashes

**Symptoms:**
- Deployment starts but crashes immediately
- Health check fails
- Service restarts repeatedly

**Solutions:**

#### Check Environment Variables
Make sure ALL required variables are set in Railway:
- ✅ `SPRING_PROFILES_ACTIVE=mysql`
- ✅ `JWT_SECRET` (any random 32+ character string)
- ✅ `MAIL_USERNAME` (your Gmail)
- ✅ `MAIL_PASSWORD` (Gmail app password)
- ✅ `APP_BASE_URL` (your Vercel URL)
- ✅ MySQL database is **linked** to your service

#### Check Database Connection
Railway automatically sets these when MySQL is linked:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`

**If database is NOT linked:**
1. Go to Railway Dashboard
2. Click "New" → "Database" → "Add MySQL"
3. Link it to your backend service

#### Check Logs
1. Go to Railway Dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click on latest deployment
5. Click "View Logs"
6. Look for errors like:
   - "Connection refused" → Database not linked
   - "Port already in use" → Multiple services running
   - "Environment variable missing" → Add missing vars

### 2. Multiple Deployments Running

**Symptoms:**
- Two services with same name
- Port conflicts
- Deployment crashes

**Solution:**
1. Go to Railway Dashboard
2. Check if you have duplicate services
3. Delete the old/unused service
4. Keep only ONE active service

### 3. Health Check Failures

**Symptoms:**
- Deployment succeeds but health check fails
- Service shows as "unhealthy"

**Solution:**
- Health check endpoint: `/actuator/health`
- Make sure `SecurityConfig` allows access to `/actuator/health`
- Check logs for health check errors

### 4. Service Keeps Restarting

**Symptoms:**
- Service starts, then immediately restarts
- Restart loop

**Common Causes:**
- Missing environment variables
- Database connection timeout
- Port conflicts

**Solution:**
1. Check all environment variables are set
2. Verify MySQL database is linked
3. Check connection timeout settings
4. Review logs for specific error

## Quick Fix Checklist

- [ ] Only ONE service is running (delete duplicates)
- [ ] MySQL database is created and linked
- [ ] All environment variables are set
- [ ] Health check endpoint is accessible
- [ ] No port conflicts
- [ ] Check deployment logs for specific errors

## Railway Dashboard Steps

1. **Check Services:**
   - Railway Dashboard → Your Project
   - Make sure only ONE backend service exists
   - Delete any duplicate services

2. **Check Database:**
   - Railway Dashboard → Your Project
   - Verify MySQL database exists
   - Click on database → "Connect" → Verify it's linked to backend

3. **Check Variables:**
   - Railway Dashboard → Backend Service → "Variables" tab
   - Verify all required variables are present
   - Check for typos in variable names

4. **Check Logs:**
   - Railway Dashboard → Backend Service → "Deployments"
   - Click latest deployment → "View Logs"
   - Look for error messages

5. **Redeploy:**
   - Railway Dashboard → Backend Service → "Deployments"
   - Click "Redeploy" if needed

## Still Having Issues?

1. Check Railway status: https://status.railway.app
2. Review Railway docs: https://docs.railway.app
3. Check your specific error in logs
4. Verify all environment variables match the guide in `RAILWAY_ENV_VARS.md`
