# 🏫 Coaching Institute Database Management System (CRUD)

A modern full-stack web application to manage student records, fee tracking, and academic workflows for a coaching institute. Built using **Next.js 14** (App Router), **Express.js**, and **MongoDB**, this system features admin authentication, analytics, and flexible course management.

---

## ✨ Key Features

- 🔐 **Admin authentication** (JWT-based, hashed passwords)
- 📚 **Full CRUD** for Students, Teachers, Courses
- 💰 **Fee tracking system** (Paid vs Pending)
- 📊 **Interactive dashboard** with live statistics and charts
- 📁 **Data filtering** by course, fee status, date
- 📥 **CSV export** for filtered student records
- 🔄 **Auto-refresh** dashboard every 30 seconds

---

## 📂 Project Structure

```

Database-Management-System-CURD/
├── backend/              # Express.js REST API
│   ├── controllers/      # Route logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── createAdmin.js    # CLI script to create an admin
│   ├── server.js         # Backend entry point
│   └── .env              # Your environment configuration
├── frontend/             # Next.js 14 (App Router)
│   ├── components/       # Reusable UI components
│   ├── app/              # App Router pages and layouts
│   ├── utils/            # Axios services, helpers
│   └── public/           # Static assets
└── README.md             # This file

````

---

## 🧰 Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | Next.js 14, Tailwind CSS, Axios  |
| Backend   | Node.js, Express.js, JWT, bcrypt |
| Database  | MongoDB + Mongoose               |
| Charts    | Chart.js (`react-chartjs-2`)     |

---

## ⚙️ Getting Started

### 🔁 1. Clone the Repository

```bash
git clone https://github.com/amphitter/Database-Management-System-CURD.git
cd Database-Management-System-CURD
````

---

### 🖥️ 2. Backend Setup

```bash
cd backend
npm install
```

#### 🛡️ Configure Environment Variables

Create a `.env` file in `/backend` with the following keys:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_PASSWORD=admin_password_to_hash
```

> Replace values with your own secure credentials.

#### 👤 Create Admin User

Generate a default admin (username: `admin`, password: from `ENCRYPTION_PASSWORD`) with:

```bash
node createAdmin.js
```

> You can customize the script to change the username/password.

#### ▶️ Run the Backend

```bash
npm run dev
```

API will be running on: [http://localhost:5000](http://localhost:5000)

---

### 💻 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### 🌐 Configure Frontend Environment

Create a `.env.local` file in `/frontend`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

> Change this to your deployed API URL in production.

#### ▶️ Run the Frontend

```bash
npm run dev
```

Visit your app at: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Admin Login

Use the credentials created in the backend setup (from `createAdmin.js`).
After login, you'll gain access to:

* 📊 Dashboard overview
* 🧾 Student & fee data
* 🎓 Course and teacher management
* 📤 Data export and filters

---

## 🧠 Core Functionalities

### ✅ Dashboard

* Total Students
* Pending vs Paid Fees
* New Admissions (last 30 days)
* Course-wise charts and graphs

### 📤 Data Export & Filters

* Export filtered student records as CSV
* Filter by course, admission date, or fee status
* Auto-updates every 30 seconds

### 📋 CRUD Modules

* Add/Edit/Delete Students, Courses, Teachers
* Realtime data reflection on dashboard

---

## 📌 Best Practices

* ❗ **Do not commit `.env` files**
* 🔑 Use long, random `JWT_SECRET` values in production
* 🔒 Deploy via HTTPS with secure cookie handling
* ⚠️ Change admin credentials before first use

---

## 🚧 Roadmap

* ✅ Attendance module
* ✅ SMS/Email notification integration
* 🔐 Role-based Teacher Dashboard
* 💵 Razorpay or Stripe integration
* 📜 Printable certificates and receipts
* 📲 Mobile app integration / PWA support

---

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 👨‍🎓 Author

Developed by [@amphitter](https://github.com/amphitter) — feel free to connect or raise issues.

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 🙋 Need Help?

Open an [issue](https://github.com/amphitter/Database-Management-System-CURD/issues) or reach out on GitHub Discussions.

```
