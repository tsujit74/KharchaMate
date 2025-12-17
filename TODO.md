# KharchaMate – TODO Checklist

> Purpose: Track development progress in a clean, professional, industry-style way.
> Rule: One checkbox = one logical task = one Git commit.

---

## 🟢 PHASE 0: Project Setup

* [ ] Initialize Git repository
* [ ] Create frontend and backend folders
* [ ] Setup Next.js frontend
* [O] Setup Node.js + Express backend
* [O] Configure environment variables
* [O] Connect MongoDB Atlas

---

## 🟢 PHASE 1: Backend (Core Logic)

### Authentication

* [O] Create User schema (MongoDB)
* [O] Signup API (password hashing)
* [O] Login API (JWT generation)
* [O] JWT auth middleware

### Group Management

* [O] Create Group schema
* [O] Create group API
* [O] Add members to group
* [O] Fetch user groups

### Expense Management (Core Feature)

* [O] Create Expense schema
* [O] Add expense API
* [O] Split amount logic
* [ ] Store who paid and who owes
* [ ] Calculate group balances
* [ ] Mark expense as paid/unpaid

### API Testing

* [O] Test auth APIs in Postman
* [O] Test group APIs in Postman
* [O] Test expense APIs in Postman
* [ ] Handle edge cases and errors

---

## 🟢 PHASE 2: Frontend

### Authentication UI

* [O] Signup page
* [O] Login page
* [O] Token handling

### Core Screens

* [O] Group list page
* [O] Create group UI
* [ ] Expense list page
* [ ] Add expense form

### Dashboard

* [ ] Balance summary view
* [ ] Paid vs pending indicators

---

## 🟢 PHASE 3: Integrations

### Payments

* [ ] Generate UPI deep links
* [ ] Pay now button

### Sharing

* [ ] WhatsApp share message
* [ ] Reminder sharing

---

## 🟢 PHASE 4: PWA & Extras (Optional)

* [ ] Add web app manifest
* [ ] Setup service worker
* [ ] Enable install prompt
* [ ] Offline caching
* [ ] Push notifications (optional)
* [ ] AI bill OCR (optional)

---

## 🟢 PHASE 5: Finalization

* [ ] Deploy backend
* [ ] Deploy frontend
* [ ] Setup environment variables in production
* [ ] Update README documentation
* [ ] Add architecture diagram

---

## ✅ Completion Rule

* All Phase 1 checkboxes must be complete before Phase 2
* MVP is considered DONE after Phase 2
* Phase 3+ are enhancements, not mandatory
