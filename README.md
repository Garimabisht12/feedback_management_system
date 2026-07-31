# Feedback Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</div>

A full-stack feedback platform for academic institutions that lets students submit feedback and enables admins to manage responses, faculty, subjects, and student records.

---

## ✨ What this project does

- Student login and feedback submission flow
- Admin dashboard for reviewing feedback
- Faculty, subjects, and student management
- Bulk upload support for academic data
- Responsive UI for both desktop and mobile users

---

## 🧰 Tech stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Multer for file uploads
- ExcelJS / XLSX for data handling

---

## 📁 Project structure

```text
project/
├── feedback-backend/
│   ├── index.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── seeds/
│   └── package.json
│
└── feedback-frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   └── utilities/
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting started

### 1. Clone the repository

```bash
git clone <repository-url>
cd project
```

### 2. Install backend dependencies

```bash
cd feedback-backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../feedback-frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## ▶️ Run the app

### Start the backend

```bash
cd feedback-backend
npm run dev
```

### Start the frontend

```bash
cd feedback-frontend
npm run dev
```

Open the frontend at http://localhost:5173 and the backend at http://localhost:5000.

---

## 👤 Roles

### Student
- Log in
- Submit feedback
- View submission status

### Admin
- Access the dashboard
- Review feedback entries
- Manage faculty, subjects, and students
- Upload data for bulk administration

---

## 📝 Notes

- Make sure MongoDB is running before launching the backend.
- The frontend communicates with the backend through the local API server.
- Update CORS and environment settings before deploying to production.

---

## ✅ Summary

This project provides a clean and practical solution for collecting and managing academic feedback with separate student and admin experiences.
