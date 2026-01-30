# 🚀 LendTracker - Production Deployment Guide

## Quick Start (Docker)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/lendtracker.git
cd lendtracker

# 2. Create environment file
cp production.env .env
# Edit .env with your values

# 3. Deploy
./deploy.sh build
./deploy.sh start
```

---

## 📋 Pre-Deployment Checklist

### Required Configuration

| Item | Description | Example |
|------|-------------|---------|
| `JWT_SECRET` | 256-bit secret key | `openssl rand -base64 64` |
| `DB_PASSWORD` | Strong database password | Use a password generator |
| `MAIL_USERNAME` | Gmail address | `your-email@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password | 16-character app password |
| `APP_BASE_URL` | Your domain | `https://lendtracker.yourdomain.com` |

### Gmail App Password Setup
1. Go to [Google Account](https://myaccount.google.com)
2. Security → 2-Step Verification (enable if not)
3. Security → App passwords
4. Generate password for "Mail"
5. Use the 16-character password

---

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- Domain name (for HTTPS)

### Step-by-Step

```bash
# 1. Set up environment
cp production.env .env
nano .env  # Fill in your values

# 2. Build and start
docker-compose up -d --build

# 3. Check status
docker-compose ps
docker-compose logs -f

# 4. Access application
# Frontend: http://localhost:80
# Backend API: http://localhost:8080/api
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild after code changes
docker-compose up -d --build

# Reset database (DANGER!)
docker-compose down -v
docker-compose up -d
```

---

## ☁️ Cloud Platform Deployment

### Option 1: Railway.app (Easiest)

1. **Create Railway Account** at [railway.app](https://railway.app)

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway add mysql
   railway up
   ```

3. **Set Environment Variables** in Railway Dashboard:
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=your-secret
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   APP_BASE_URL=https://your-app.railway.app
   ```

4. **Deploy Frontend** to Vercel:
   ```bash
   cd lendtracker-ui
   npx vercel --prod
   ```
   Set `VITE_API_URL=https://your-backend.railway.app/api`

### Option 2: Render.com

1. **Backend:**
   - New Web Service → Connect GitHub repo
   - Build Command: `./mvnw package -DskipTests`
   - Start Command: `java -jar target/*.jar`
   - Add PostgreSQL database
   - Set environment variables

2. **Frontend:**
   - New Static Site → Connect GitHub repo
   - Build Command: `cd lendtracker-ui && npm install && npm run build`
   - Publish Directory: `lendtracker-ui/dist`

### Option 3: DigitalOcean / AWS

```bash
# SSH to your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Clone and deploy
git clone https://github.com/yourusername/lendtracker.git
cd lendtracker
cp production.env .env
nano .env
docker-compose up -d
```

---

## 🔒 SSL/HTTPS Setup

### Using Nginx Proxy Manager (Docker)

```yaml
# Add to docker-compose.yml
  nginx-proxy:
    image: jc21/nginx-proxy-manager:latest
    ports:
      - "80:80"
      - "443:443"
      - "81:81"  # Admin panel
    volumes:
      - npm_data:/data
      - npm_letsencrypt:/etc/letsencrypt
```

### Using Cloudflare (Free SSL)
1. Add domain to Cloudflare
2. Point DNS to your server
3. Enable "Full" SSL mode
4. Done!

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:80/health
```

### Logs

```bash
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

---

## 🔄 Updates & Maintenance

### Deploy Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build
```

### Database Backup

```bash
# Backup
docker exec lendtracker-mysql mysqldump -u root -p lendtracker > backup.sql

# Restore
docker exec -i lendtracker-mysql mysql -u root -p lendtracker < backup.sql
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - DATABASE_URL not set
# - JWT_SECRET too short
# - Port 8080 in use
```

### Database connection failed
```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Test connection
docker exec -it lendtracker-mysql mysql -u lendtracker -p
```

### Frontend can't reach backend
```bash
# Check if backend is accessible
curl http://backend:8080/actuator/health

# Check nginx logs
docker-compose logs frontend
```

---

## 📁 File Structure

```
LendTracker/
├── Dockerfile              # Backend Docker config
├── docker-compose.yml      # Full stack orchestration
├── production.env          # Environment template
├── deploy.sh               # Deployment script
├── lendtracker-ui/
│   ├── Dockerfile          # Frontend Docker config
│   └── nginx.conf          # Nginx configuration
└── src/
    └── main/resources/
        ├── application.properties
        ├── application-prod.properties
        └── application-postgres.properties
```

---

## 🆘 Support

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Ensure ports 80, 443, 8080, 3306 are available
4. Check [GitHub Issues](https://github.com/yourusername/lendtracker/issues)
