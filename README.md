# 💰 LendTracker

**Smart Loan Tracking for Smart Lenders** - Track personal loans, calculate interest, and manage repayments with ease.

![LendTracker](https://img.shields.io/badge/version-1.0.0-green) ![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen) ![React](https://img.shields.io/badge/React-18-blue)

## ✨ Features

- 📊 **Dashboard** - Overview of all loans with charts and statistics
- 💳 **Loan Management** - Add, edit, delete, and track loans
- 🧮 **Interest Calculator** - Calculate interest with multiple frequencies (daily, weekly, monthly, quarterly, yearly)
- 📜 **Payment History** - Track all interest and principal payments received
- 👥 **Multi-user** - Each user has their own private loan data
- 🔐 **Secure Authentication** - JWT-based auth with email OTP verification
- 🌐 **Multi-language** - English & Telugu support
- 📱 **Mobile App** - Android APK available via Capacitor
- 📄 **Export** - Generate PDF and CSV reports

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+ (or use H2 for development)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/lendtracker.git
cd lendtracker

# Run with H2 database (development)
./mvnw spring-boot:run

# Or run with MySQL
./mvnw spring-boot:run -Dspring.profiles.active=mysql
```

### Frontend Setup
```bash
cd lendtracker-ui
npm install
npm run dev
```

### Build Mobile App
```bash
cd lendtracker-ui
npm run build
npx cap sync android
npx cap open android
```

## 🐳 Docker Deployment

```bash
# Copy environment template
cp production.env .env

# Edit .env with your values
nano .env

# Deploy
docker-compose up -d
```

## ☁️ Cloud Deployment

### Railway (Recommended)
1. Connect GitHub repo to [Railway](https://railway.app)
2. Add MySQL database
3. Set environment variables
4. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
LendTracker/
├── src/                    # Spring Boot backend
│   └── main/
│       ├── java/          # Java source code
│       └── resources/     # Config files
├── lendtracker-ui/        # React frontend
│   ├── src/               # React source
│   ├── android/           # Capacitor Android
│   └── ios/               # Capacitor iOS
├── Dockerfile             # Backend container
├── docker-compose.yml     # Full stack
└── railway.json           # Railway config
```

## 🔧 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing key | (required in prod) |
| `SPRING_PROFILES_ACTIVE` | Profile: dev, mysql, prod | dev |
| `MAIL_USERNAME` | Gmail address for OTP | - |
| `MAIL_PASSWORD` | Gmail app password | - |

## 📱 Mobile App

The app is built with Capacitor and supports:
- Android (APK available)
- iOS (coming soon)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Built with ❤️ for Indian lenders**
