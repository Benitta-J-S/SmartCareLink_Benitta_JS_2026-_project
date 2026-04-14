# 🚑 CareLink - Patient Safety Monitoring System

## 📌 Project Overview


## 📱 Overview
CareLink is a **real-time patient safety monitoring system** that connects patients, families, and administrators through a mobile app and web dashboard.

## ✨ Features
- 🚨 **One-touch Panic Button** - Instant emergency alerts
- 📍 **Real-time GPS Tracking** - Live patient location
- 👁️ **Password Visibility Toggle** - Show/hide password
- 🔐 **JWT Authentication** - Secure login system
- 📊 **Admin Dashboard** - Monitor all patients
- 📱 **Cross-platform Mobile App** - Works on iOS & Android

## 🛠 Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB |
| Frontend | React, Material-UI |
| Mobile | React Native, Expo |

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB installed or MongoDB Atlas account
- Expo Go app on phone

### Run Locally

```bash
# 1. Start Backend
cd backend
npm install
node server.js

# 2. Start Dashboard (new terminal)
cd dashboard/admin-dashboard
npm install
npm start

# 3. Start Mobile App (new terminal)
cd mobile/CareLinkApp
npm install
npx expo start -c

## 📷 Screenshots

![Dashboard](./images/dashboard_img.png)

### 🚨 Alerts View
![Alerts](./images/alert_dashboard.png)

### 🔐 Login Page
![Login](./images/login_pg.png)
---

## ▶️ How to Run the Project

### 🔹 Clone the repository

```bash
git clone https://github.com/Benitta-J-S/SmartCareLink_Benitta_JS_2026-_project.git
cd  carelink
```

### 🔹 Run Backend

```bash
cd backend
node server.js
```

### 🔹 Run Frontend

```bash
cd dashboard/admin-dashboard
npm install
npm start
```

---

## 📡 API Endpoints

### 🔹 Health Check

```bash
GET /api/health
```

### 🔹 Get Alerts

```bash
GET /api/alerts
```

### 🔹 Acknowledge Alert

```bash
POST /api/acknowledge/:id
```

---

## 🧠 System Workflow

1. Sensors or data sources send patient data
2. Backend processes and detects abnormalities
3. Alerts are generated for critical conditions
4. Dashboard displays alerts in real-time
5. User can acknowledge alerts

---

## 🎯 Future Enhancements

* ✅ Store alerts in MongoDB
* 📈 Add graphical charts for vitals
* 🔔 Add sound notifications
* 🌍 Deploy project online (AWS / Render / Vercel)

---

## 👩‍💻 Author

**Benitta J S**
GitHub:https://github.com/Benitta-J-S
LinkedIn:https://www.linkedin.com/in/benitta-j-s-14126025a/

---

## ⭐ Conclusion

CareLink is a powerful and scalable healthcare monitoring solution that demonstrates real-time system design, full-stack development, and practical implementation of modern web technologies.

---

⭐ If you like this project, give it a star on GitHub!

