# 🚀 LendTracker - Production Deployment Checklist

## ✅ Pre-Deployment Tasks

### 1. Environment Configuration
- [ ] Copy `production.env` to `.env`
- [ ] Generate strong `JWT_SECRET` (min 256-bit): `openssl rand -base64 64`
- [ ] Set strong `DB_PASSWORD`
- [ ] Set strong `MYSQL_ROOT_PASSWORD`
- [ ] Configure Gmail App Password for emails
- [ ] Set `APP_BASE_URL` to your domain

### 2. Domain & SSL
- [ ] Point domain DNS to server
- [ ] Configure SSL certificate (Cloudflare/Let's Encrypt)

### 3. Database
- [ ] MySQL/PostgreSQL provisioned
- [ ] Connection string verified

---

## 🚀 Deployment Options

### Option A: Docker (VPS/DigitalOcean/AWS)

```bash
# 1. SSH to server
ssh root@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com | sh

# 3. Clone repo
git clone https://github.com/yourusername/lendtracker.git
cd lendtracker

# 4. Configure environment
cp production.env .env
nano .env

# 5. Deploy
docker-compose up -d --build

# 6. Verify
curl http://localhost:8080/actuator/health
```

### Option B: Railway (Backend) + Vercel (Frontend)

**Backend on Railway:**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select LendTracker repo
4. Add MySQL service
5. Set environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=your-generated-secret
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   APP_BASE_URL=https://your-frontend-url.vercel.app
   ```
6. Deploy!

**Frontend on Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub → select `lendtracker-ui` folder
3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
4. Deploy!

### Option C: Render.com (Full Stack)

**Backend:**
1. New Web Service
2. Connect GitHub → Root: `/`
3. Build: `./mvnw package -DskipTests`
4. Start: `java -jar target/*.jar`
5. Add PostgreSQL
6. Set env vars (use `application-postgres.properties`)

**Frontend:**
1. New Static Site
2. Connect GitHub → Root: `lendtracker-ui`
3. Build: `npm install && npm run build`
4. Publish: `dist`

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is at least 256 bits
- [ ] Database passwords are strong (20+ chars)
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Email app password (not regular password)
- [ ] H2 console disabled in production (`spring.h2.console.enabled=false`)

---

## 📧 Email Configuration (Gmail)

1. Go to https://myaccount.google.com
2. Security → 2-Step Verification → Enable
3. Security → App passwords
4. Select app: Mail, Device: Other (LendTracker)
5. Copy 16-character password
6. Use in `MAIL_PASSWORD`

---

## 🔍 Post-Deployment Verification

```bash
# Backend health
curl https://your-api-domain.com/actuator/health

# Test registration
curl -X POST https://your-api-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Frontend accessible
curl -I https://your-frontend-domain.com
```

---

## 🆘 Quick Fixes

### "Database connection refused"
- Check DATABASE_URL format
- Verify DB service is running
- Check firewall/security groups

### "JWT signature invalid"
- Ensure JWT_SECRET is same across deployments
- Token might be expired, log in again

### "Emails not sending"
- Verify Gmail App Password (not regular password)
- Check MAIL_USERNAME is correct
- Ensure 2FA is enabled on Gmail

### "CORS errors"
- Check APP_BASE_URL matches frontend URL
- Verify VITE_API_URL in frontend

---

## 📞 Support

- GitHub Issues: [Create issue](https://github.com/yourusername/lendtracker/issues)
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
