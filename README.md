# KharchaMate

KharchaMate is a **Splitwise-like expense management application** built to fairly split group expenses, track balances, and settle payments among friends. The project is designed as a **strong portfolio-grade full‑stack application**, focusing on clean architecture, real‑world logic, and scalability.


🔗 **Live Demo:** https://kharcha-mate.vercel.app/  
📦 **Repository:** https://github.com/tsujit74/KharchaMate

---

## 🚀 Features

### ✅ Core Features (Completed)

* 👥 Create groups and add members
* 💰 Add expenses to groups
* 📊 Automatic equal expense splitting
* 🧮 Settlement calculation (who owes whom)
* 🤝 Mark payments as settled
* 🧾 Expense history with date & time
* 📈 Group dashboard (total spent, per‑person share, balances)

### 🔐 Authentication & Authorization (In Progress)

* User registration & login
* JWT‑based authentication
* Protected routes (frontend & backend)
* Auth state management using React Context

### 🔮 Future Features

* Custom split (unequal splits)
* Expense categories
* Push notifications
* WhatsApp / shareable payment links
* AI bill OCR

---

## 🏗️ Tech Stack

### Frontend

* **Next.js (App Router, no `/src`)**
* **TypeScript**
* **Tailwind CSS**
* **React Context API** (authentication & user state)
* **Axios** (API calls with interceptors)

### Backend

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT Authentication**

---

## 📁 Project Structure

```
KharchaMate/
│
├── backend/
│   ├── config/                 # DB & environment configuration
│   ├── controllers/            # Request–response logic
│   ├── middleware/             # Auth & error middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes
│   ├── service/                # Business logic (settlementService etc.)
│   ├── .env
│   ├── package.json
│   └── server.js               # Backend entry point
│
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # AuthContext & global state
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── groups/             # Group & expense pages
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── profile/            # User profile
│   │   ├── services/           # API service layer
│   │   ├── utils/              # Helper utilities
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx       # Context providers
│   │
│   ├── public/
│   ├── globals.css
│   └── package.json
│
└── README.md

```

---

## 🧠 Settlement Logic (How It Works)

1. Calculate **total group expense**
2. Divide equally among all members
3. Track how much each member actually paid
4. Compute net balance:

   * `balance = paid − share`
5. Generate settlements:

   * Debtors pay creditors until balances reach zero

✔ Accurate balances  
✔ Minimal number of transactions  
✔ Real-world friendly approach 

---

## 🔐 Authentication Design

* JWT stored in `localStorage`
* User + token stored in **AuthContext**
* Axios interceptor attaches token to every request
* Protected routes handled via client‑side guard

This design is **simple, scalable, and production‑ready**.

---

## 🛠️ Run Locally

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

---

### Backend
```bash
cd backend
npm install
npm run dev

```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## App will run on

http://localhost:3000

## 🧪 API Testing

* All APIs tested using **Thunder Client / Postman**
* Settlement & payment APIs fully functional

---

## 🎯 Project Goal

KharchaMate is built as a **resume‑focused project** to demonstrate:

* Full‑stack development skills
* Real‑world business logic
* Clean code & architecture
* Backend + frontend integration

---

## 👤 Author

**Sujit Thakur**

* 🌐 Portfolio: [https://sujit-porttfolio.vercel.app/](https://sujit-porttfolio.vercel.app/)
* 💻 GitHub: [https://github.com/tsujit74](https://github.com/tsujit74)
* 📧 Email: [tsujeet440@gmail.com](mailto:tsujeet440@gmail.com)

---

## ⭐️ Final Note

This project is actively evolving. Each feature is built step‑by‑step with proper planning, making it easy to extend and maintain.

If you like this project, feel free to ⭐️ the repo!
