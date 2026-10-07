# KharchaMate

### A Real-World Group Expense & Settlement Platform

KharchaMate is a **full-stack group expense management platform** designed to handle the complete lifecycle of shared expenses — from creating groups and recording expenses to calculating balances, generating settlements, managing payment requests, and tracking financial activity.

Unlike a basic expense tracker or CRUD application, KharchaMate focuses on **real-world financial workflows, business rules, settlement optimization, authorization, and group lifecycle management**.

It supports two distinct group models:

* **Normal Groups** — designed for short-term activities such as trips, dinners, events, or one-time shared expenses.
* **Ongoing Groups** — designed for long-running shared expenses such as roommates, families, teams, or recurring household spending.

---

## 🌐 Live Project

**Live Demo:** https://kharcha-mate.vercel.app/

**Repository:** https://github.com/tsujit74/KharchaMate

---

# ✨ Why KharchaMate?

KharchaMate was built around a simple real-world problem:

> **When multiple people share expenses, who actually owes whom — and how should those payments be settled with the fewest possible transactions?**

The application goes beyond storing expenses.

It handles:

* Group creation and membership
* Multiple expense-splitting strategies
* Member-level balances
* Settlement calculation
* Settlement requests and confirmation
* Payment tracking
* UPI QR-based payments
* Expense editing restrictions
* Group lifecycle rules
* Budget tracking
* OCR-based expense extraction
* Group-level financial visibility

The goal is to model the **actual business logic behind shared expenses**, rather than simply performing CRUD operations.

---

# 🚀 Core Features

## 👥 Group Management

* Create expense groups
* Add and manage members
* Support **Normal** and **Ongoing** group types
* Track group members and their financial activity
* Group period management
* Soft-delete groups
* Prevent unsafe membership changes after financial activity begins
* Group-specific financial context

### Normal Groups

Designed for short-term activities:

* Trips
* Dinners
* Events
* Vacations
* One-time purchases

### Ongoing Groups

Designed for long-running shared expenses:

* Roommates
* Families
* Teams
* Household expenses
* Long-term shared spending

This distinction allows KharchaMate to handle different group lifecycles instead of treating every group as the same type of entity.

---

# 💰 Expense Management

KharchaMate supports detailed expense tracking inside groups.

### Supported capabilities

* Add expenses
* Edit expenses
* Track who paid
* Track each member's share
* Equal splitting
* Custom/unequal splitting
* Expense history
* Date and time tracking
* Expense categories
* Expense-level business restrictions

### Expense Categories

* 🍔 Food
* ✈️ Travel
* 🏠 Rent
* 🛍️ Shopping
* 📱 Recharge
* 📦 Other

---

# 🧮 Expense Splitting Engine

For equal splitting, the system calculates each member's share based on the total expense and participating members.

For example:

```text
Total Expense = ₹3,000
Members = 3

Each Member's Share = ₹1,000
```

The system then compares:

```text
Amount Paid - Amount Owed
```

to determine each member's net balance.

### Balance interpretation

```text
Positive balance → Member should receive money

Negative balance → Member owes money

Zero balance → Member is settled
```

This forms the foundation of the settlement engine.

---

# 🤝 Settlement Engine

One of the core parts of KharchaMate is the settlement calculation system.

The application determines:

* Who owes money
* Who should receive money
* How much should be transferred
* How to reduce unnecessary transactions

### Basic calculation

```text
Net Balance = Amount Paid - Member's Share
```

The settlement engine separates:

```text
Debtors
   ↓
Creditors
   ↓
Settlement Transactions
```

The goal is to settle the group with a **minimal and practical number of transactions**.

Example:

```text
Rahul → ₹1,000
Amit  → ₹500
Sujit → -₹1,500
```

The system can generate:

```text
Sujit → Rahul   ₹1,000
Sujit → Amit    ₹500
```

This turns raw expense records into actionable payment obligations.

---

# 💳 Payment & Settlement Workflow

KharchaMate doesn't stop after calculating who owes whom.

The application supports a complete settlement workflow.

### Settlement lifecycle

```text
Expense
   ↓
Balance Calculation
   ↓
Settlement Generation
   ↓
Payment Request
   ↓
Payment Initiated
   ↓
Payment Confirmation
   ↓
Completed Settlement
```

Supported settlement states include:

```text
PENDING
INITIATED
COMPLETED
CANCELLED
```

Each settlement can also have a unique transaction reference.

---

# 📱 UPI Payment Support

KharchaMate includes UPI-based payment support to make settlement practical.

Users can generate/use a **UPI QR flow** when settling an amount.

This bridges the gap between:

> "You owe ₹500"

and

> "Here is how you can actually pay ₹500."

---

# 🔐 Authentication & Authorization

Security is handled across both frontend and backend.

### Authentication

* User registration
* User login
* JWT-based authentication
* JWT stored using **httpOnly cookies**
* Authenticated user state
* Protected application routes

### Authorization

Backend operations verify:

* User authentication
* Group membership
* Permission to perform the requested operation

Financial operations are therefore not trusted solely based on frontend state.

---

# 🛡️ Real-World Business Rules

KharchaMate contains several business rules designed to prevent inconsistent financial data.

Examples include:

### Expense Editing

Expense modification is restricted by business rules.

* Only the appropriate payer/member can modify the expense
* Expense editing is limited by a defined time window
* Financial records cannot be changed arbitrarily

### Group Membership

Once financial activity exists within a group, member modifications are restricted to prevent existing expense calculations from becoming inconsistent.

### Payment Locks

Payment-related operations use locking logic to help prevent conflicting settlement operations.

### Group Deletion

Groups use a **soft-delete approach** rather than blindly removing financial records.

This preserves the integrity of historical data.

---

# 📊 Group Dashboard

Each group provides financial visibility including:

* Total group spending
* Member-level spending
* Individual shares
* Current balances
* Settlement information
* Expense history

The dashboard is designed around the question:

> **"What is happening financially inside this group?"**

rather than simply displaying a list of database records.

---

# 📈 Budgets

KharchaMate includes budget tracking for managing spending within groups.

Users can monitor:

```text
Budget
   ↓
Actual Spending
   ↓
Remaining Amount
```

This adds a planning layer on top of basic expense tracking.

---

# 🧾 OCR Expense Support

KharchaMate also includes OCR functionality for extracting expense information from bills/receipts.

The goal is to reduce manual entry when recording real-world expenses.

Typical workflow:

```text
Bill / Receipt
      ↓
OCR Processing
      ↓
Extracted Information
      ↓
Expense Creation
```

---

# 🔒 Financial Data Integrity

Because expense and settlement data are interconnected, KharchaMate applies rules around financial state transitions.

Examples:

* Settlement status tracking
* Payment locks
* Membership restrictions
* Controlled expense editing
* Group soft deletion
* Membership verification
* Transaction references
* Backend-side authorization

These rules help prevent situations where changing one record silently breaks existing balances or settlements.

---

# 🏗️ Architecture

KharchaMate follows a separate frontend/backend architecture.

```text
┌───────────────────────────────┐
│          Next.js App          │
│                               │
│  UI / Pages / Context / API   │
└───────────────┬───────────────┘
                │
                │ HTTP / API
                ▼
┌───────────────────────────────┐
│        Express Backend        │
│                               │
│ Routes → Controllers → Logic  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        MongoDB / Mongoose     │
│                               │
│ Users / Groups / Expenses /  │
│ Settlements / Transactions   │
└───────────────────────────────┘
```

The backend separates responsibilities across:

* Routes
* Controllers
* Middleware
* Models
* Services
* Authentication
* Business logic

This keeps complex operations such as settlement calculation away from the UI layer.

---

# 📁 Project Structure

```text
KharchaMate/
│
├── backend/
│   ├── config/                 # Database and application configuration
│   ├── controllers/            # Request handling and controller logic
│   ├── middleware/             # Authentication and request middleware
│   ├── models/                 # Mongoose database models
│   ├── routes/                 # Express API routes
│   ├── service/                # Business logic and backend services
│   ├── sockets/                # Real-time functionality
│   ├── .env                    # Backend environment variables
│   ├── package.json            # Backend dependencies and scripts
│   └── server.js               # Backend entry point
│
├── frontend/
│   ├── app/
│   │   ├── admin/              # Admin functionality
│   │   ├── auth/               # Authentication-related functionality
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context providers
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── forgot-password/    # Password recovery
│   │   ├── groups/             # Group and expense functionality
│   │   ├── hooks/              # Custom React hooks
│   │   ├── login/              # Login page
│   │   ├── notifications/      # Notification functionality
│   │   ├── profile/            # User profile
│   │   ├── reset-password/     # Password reset
│   │   ├── services/           # API/service layer
│   │   ├── settlement-requests/# Settlement request functionality
│   │   ├── signup/             # Registration page
│   │   ├── utils/              # Utility functions
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Application entry page
│   │
│   └── public/
│       └── images/             # Static assets
│
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* **Next.js** — App Router
* **TypeScript**
* **React**
* **Tailwind CSS**
* **React Context API**
* **Axios**
* **Recharts**
* **Lucide**
* **React Hot Toast**
* **next-pwa**

## Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT Authentication**

## Development & Testing

* Postman
* Thunder Client
* Git
* GitHub

---

# 🔄 API & Backend Design

The frontend communicates with the Express backend through dedicated API/service layers.

A typical request follows:

```text
Frontend
   ↓
API Service
   ↓
Express Route
   ↓
Authentication Middleware
   ↓
Controller
   ↓
Business Service
   ↓
MongoDB
```

For protected financial operations, the backend verifies authentication and relevant group membership before modifying data.

---

# 🧪 API Testing

Backend APIs have been tested using:

* **Postman**
* **Thunder Client**

Testing includes important workflows such as:

* Authentication
* Group operations
* Expense creation
* Expense splitting
* Settlement calculation
* Payment operations
* Settlement state transitions
* Authorization checks

---

# ⚙️ Run Locally

## Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/tsujit74/KharchaMate.git

cd KharchaMate
```

---

## 2. Start the Backend

```bash
cd backend

npm install

npm run dev
```

Configure the required environment variables in:

```text
backend/.env
```

---

## 3. Start the Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

Backend environment configuration should contain the required values for:

```text
MongoDB connection
JWT configuration
Application configuration
Other required service credentials
```

Do not commit `.env` files or secrets to the repository.

---

# 🧠 Engineering Highlights

KharchaMate demonstrates more than frontend CRUD implementation.

### 1. Financial Business Logic

The application calculates:

```text
Expenses
   ↓
Member Shares
   ↓
Net Balances
   ↓
Debtors / Creditors
   ↓
Settlement Transactions
```

### 2. State-Based Workflows

Settlements move through controlled states instead of simply using a boolean:

```text
PENDING
   ↓
INITIATED
   ↓
COMPLETED

        ↘
        CANCELLED
```

### 3. Authorization

Protected operations are verified at the backend rather than relying only on frontend guards.

### 4. Data Integrity

Financial records are protected through:

* Membership validation
* Payment locks
* Controlled editing
* Soft deletion
* Settlement state management

### 5. Scalable Separation of Responsibilities

Business logic is separated from:

* UI components
* API routes
* Controllers
* Database models

This makes the application easier to extend without turning the codebase into tightly coupled CRUD logic.

---

# 🗺️ Roadmap

KharchaMate is actively evolving.

Planned improvements include:

* 📄 PDF group expense reports
* 📊 CSV expense exports
* 📅 Advanced period-based analytics
* 📸 Improved bill OCR workflows
* 🔁 Recurring expenses
* 📌 Monthly group snapshots
* 🗂️ Group archive lifecycle
* 📝 Group activity/audit history
* ⚠️ Expense dispute and correction workflow
* 🔍 Duplicate expense detection
* ⚡ Quick expense templates
* 🔔 Enhanced notifications
* 📤 Shareable payment/settlement flows

Features are added incrementally with a focus on maintaining existing financial correctness and application stability.

---

# 🎯 Project Goals

KharchaMate was built as a portfolio-grade full-stack project to demonstrate:

* Full-stack application development
* React and Next.js development
* REST API design
* MongoDB data modeling
* Authentication and authorization
* Financial/business logic
* State-based workflows
* Settlement algorithms
* Backend validation
* Data integrity
* Real-world edge-case handling
* Clean separation of responsibilities
* Frontend/backend integration

The project intentionally goes beyond a simple:

```text
Create → Read → Update → Delete
```

approach.

Its focus is on modelling a **real-world financial workflow** where multiple users, expenses, balances, payments, and settlement states interact with each other.

---

# 👤 Author

## Sujit Thakur

Full-Stack Developer focused on building practical, production-oriented web applications.

* 🌐 Portfolio: https://sujit-porttfolio.vercel.app/
* 💻 GitHub: https://github.com/tsujit74/
* 📧 Email: [tsujeet440@gmail.com](mailto:tsujeet440@gmail.com)

---

# ⭐ Final Note

KharchaMate is an actively evolving project.

The objective is not simply to keep adding features, but to build each feature around **real-world requirements, business rules, data integrity, and maintainable architecture**.

From splitting a ₹500 dinner bill to managing an ongoing group with multiple expenses and settlements, KharchaMate is designed to make shared finances **clear, trackable, and easier to settle**.

If you find the project interesting, consider giving the repository a ⭐.
