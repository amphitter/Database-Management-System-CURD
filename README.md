# 📘 Database Management System – CURD (Coaching Institute)

**Hands-on CRUD web application for managing coaching classes**
Built with **Node.js + Express** (backend) and **React** (frontend).

---

## 🚀 Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Setup Guide](#setup-guide)

   1. [Clone the repo](#clone-the-repo)
   2. [Backend setup](#backend-setup)
   3. [Frontend setup](#frontend-setup)
4. [Database Configuration](#database-configuration)
5. [Usage](#usage)

   * CRUD operations
   * Sample data
6. [Project Structure](#project-structure)
7. [Technologies Used](#technologies-used)
8. [Future Enhancements](#future-enhancements)
9. [Contact](#contact)

---

## ✨ Features

* **CRUD functionality** for:

  * Students
  * Courses
  * Teachers
  * Enrollments
* RESTful API (Node.js + Express)
* React front-end for UI interaction
* Structured for coaching institute needs (student/course enrollments, teacher assignments)

---

## ✅ Prerequisites

* **Node.js** (v14+)
* **npm** (v6+) or **yarn**
* **MongoDB** (or your preferred database running locally or via cloud)
* Optional: **Postman** for API testing

---

## 🛠️ Setup Guide

### Clone the repo

```bash
git clone https://github.com/amphitter/Database-Management-System-CURD.git
cd Database-Management-System-CURD
```

---

### Backend setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure environment:

   * Create a `.env` file:

     ```dotenv
     MONGODB_URI=<your_mongo_db_connection_string>
     PORT=5000
     ```
4. Launch the backend:

   ```bash
   npm run dev
   ```

---

### Frontend setup

1. Move to the frontend folder:

   ```bash
   cd ../frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the React app:

   ```bash
   npm start
   ```
4. Visit `http://localhost:3000`. The app connects to backend on port `5000`.

---

## 🗄️ Database Configuration

* Uses **MongoDB**
* Collections:

  * `students`
  * `courses`
  * `teachers`
  * `enrollments`
* Example schema:

  ```js
  {
    name: String,
    email: String,
    enrolledCourseIds: [ObjectId],
    teacherId: ObjectId
  }
  ```
* Modify schemas in `backend/models/` as per your structure.

---

## 🎯 Usage

* **Add** new students, courses, teachers, and enrollments via UI forms.
* **View** lists of all entities with clear relational data.
* **Edit** and **Delete** records inline.
* **Sample data**: Use Postman or create scripts in `backend/db/`.

---

## 🗂️ Project Structure

```text
/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🧰 Technologies Used

* **Backend**: Node.js, Express, Mongoose, dotenv
* **Frontend**: React, Axios, React Router
* **Database**: MongoDB

---

## 🚧 Future Enhancements

* Add **authentication/authorization** for admin and teachers
* Implement **role-based access control**
* Add **reporting dashboard** (attendance, progress tracking)
* Switch to SQL-based databases (PostgreSQL/MySQL)
* Enhance UI with **Material UI** or **Bootstrap**

---

## 🙋 Contact

Created by `@amphitter`.
For questions or collaboration, reach out via GitHub.

---

### ✅ Getting Started Checklist

* [ ] Clone project
* [ ] Install and configure MongoDB
* [ ] Install backend and frontend packages
* [ ] Run backend and frontend servers
* [ ] Use forms to manage students, courses, teachers, enrollments
* [ ] Extend schemas and UI as needed

---
