# KoiHR (ongoing)

A full-stack Human Resource Management System built with ASP.NET Core Web API and Angular, featuring JWT authentication, role-based access control, and a clean Material Design UI.

⚠️ This project is currently under active development. Some features may be incomplete or subject to change.

---

## Features

### ✅ Implemented

* JWT-based authentication
* Role-based access control (Admin, HR, Employee)
* Department management (CRUD)
* Employee management (CRUD)
* User management

### 🕒 Attendance Management

* Employee check-in (InTime) and check-out (OutTime) functionality
* Prevent duplicate check-ins for the same day
* Enforced rule: check-in required before check-out
* Automatic attendance status calculation (Present / Late / Absent)
* Late detection based on configurable grace period
* Department-wise attendance settings (InTime, OutTime, Grace Period)
* Get attendance by date (Admin/HR view for all employees)
* Get monthly attendance report per employee
* Get logged-in employee’s full attendance history
* Get current day attendance status for logged-in employee

### 🛡️ Authorization & UI

* Role-based sidebar navigation
* Route guards for unauthorized access protection
* Profile page (view logged-in user info)

---

## Tech Stack

### Backend

* ASP.NET Core Web API (.NET 8)
* Entity Framework Core
* ASP.NET Core Identity
* SQL Server
* JWT Authentication
* Swagger

### Frontend

* Angular 21
* Angular Material
* Reactive Forms
* JWT Decode
* Angular Guards & Interceptors

---

## Getting Started

### Prerequisites

* .NET 8 SDK
* Node.js (v18+)
* Angular CLI
* SQL Server

---

## Backend Setup

1. Clone the repository
2. Update the connection string
3. Apply migrations and seed the database
4. Run the API

Swagger UI is accessible at:
https://localhost:7063/swagger

---

## Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies:

   ```bash
   npm install
   ```
3. Update the API base URL in:

   ```
   src/environments/environment.development.ts
   ```

   ```ts
   export const environment = {
     baseUrl: 'https://localhost:7063/api/'
   };
   ```
4. Run the Angular app:

   ```bash
   ng serve
   ```

The app will be available at:
http://localhost:4200

---

## Frontend Usage

### Login

Enter your credentials. On success, a JWT token is stored in localStorage and you are redirected to the dashboard.

### Navigation

Sidebar navigation items are filtered based on your role:

* **Admin** → Full access
* **HR** → HR-related modules
* **Employee** → Profile + attendance

---

## Attendance Usage

### Employee Actions

* Mark attendance (check-in) once per day
* Update attendance with check-out time
* View personal attendance history
* View today’s attendance status

### Admin / HR Actions

* View attendance of all employees by date
* View monthly attendance report per employee
* Configure attendance settings per department

  * Office start time
  * Office end time
  * Grace period for late entry

---

## Route Protection

Attempting to access a restricted route directly will redirect you to the `/unauthorized` page.

---

## Contributing

This project is currently in development. Suggestions and feedback are welcome.
