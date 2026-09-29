# Where U — IoT-Based GPS-Geofenced Attendance Monitoring System

> An IoT-based and GPS-geofenced student attendance monitoring system with a live web dashboard, developed for educational and research purposes.

---

## 📖 Overview

**Where U** is a web-based attendance verification system that uses **GPS geofencing** to confirm that students are physically present on campus before marking them present. It replaces traditional roll calls and RFID-only systems with a location-aware, subject-scheduled, real-time monitoring solution.

The system was built as a research project to explore the feasibility of **location-based attendance verification** using only a smartphone, a cloud database, and a web browser — no specialized hardware required.

---

## 🎯 Research Objectives

This project aims to:

1. **Eliminate proxy attendance** — students cannot check in from outside the campus
2. **Automate attendance logging** — no manual roll call or paperwork
3. **Provide real-time visibility** — teachers see live attendance per subject
4. **Explore low-cost alternatives** — no RFID, no biometrics, no dedicated hardware
5. **Serve as a template** for schools exploring digital attendance systems

---

## 🔬 Research Context

Traditional attendance systems suffer from two major issues:

- **Proxy attendance** — students give their ID or card to a friend
- **Manual inefficiency** — teachers spend class time calling names

Existing solutions (RFID, fingerprint, facial recognition) require hardware, setup costs, and maintenance. This study investigates whether **GPS geofencing via a smartphone browser** can provide similar reliability at near-zero infrastructure cost.

The system builds on concepts from prior work in geofenced attendance systems (e.g., RFID + GPS + BLE studies) but removes the need for dedicated readers.

---

## 🔄 How It Works

1. Student opens the web app on their phone
2. Enters their Student ID
3. System checks if the ID exists in the database
4. System checks if a class is currently in session
5. Student allows GPS access
6. System checks if the student is inside the campus polygon
7. If inside → **Present** | If outside → **Rejected**
8. Teacher sees the result on the dashboard

---

## 📁 Files

| File | Purpose |
| :--- | :--- |
| `index.html` | Student check-in page |
| `dashboard.html` | Teacher dashboard |
| `help.html` | Student instructions |
| `privacy.html` | Privacy policy |
| `firebase-config.js` | Firebase credentials |
| `geofence.js` | Campus polygon + point-in-polygon algorithm |

---

## 🛠️ Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **Firebase Realtime Database** | Cloud database |
| **GitHub Pages** | Hosting |
| **HTML / CSS / JavaScript** | Frontend |
| **Google Maps** | Campus GPS coordinates |
| **Point-in-Polygon Algorithm** | Geofence verification |

