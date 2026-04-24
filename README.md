# Employee Management System

A full-stack Employee Management System built with **ASP.NET Core Web API** and **Angular**, featuring JWT authentication, role-based access control, and a clean Material Design UI.

> ⚠️ This project is currently under active development. Some features may be incomplete or subject to change.

---

## Features

### Implemented
- JWT-based authentication
- Role-based access control (Admin, HR, Employee)
- Department management (CRUD)
- Employee management (CRUD)
- User management
- Role-based sidebar navigation
- Route guards for unauthorized access protection
- Profile page (view logged-in user info)

### In Progress
- Dashboard analytics

---

## Tech Stack

### Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- ASP.NET Core Identity
- SQL Server
- JWT Authentication
- Swagger

### Frontend
- Angular 21
- Angular Material
- Reactive Forms
- JWT Decode
- Angular Guards & Interceptors

---

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.io/cli)
- SQL Server

### Backend Setup

1. Clone the repository:

2. Update the connection string

3. Apply migrations and seed the database:

4. Run the API:
   

Swagger UI is accessible at `https://localhost:7063/swagger`.

### Frontend Setup

1. Navigate to the frontend directory:

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API base URL in `src/environments/environment.development.ts`:
   ```typescript
   export const environment = {
     baseUrl: 'https://localhost:7063/api/'
   };
   ```

4. Run the Angular app:
   ```bash
   ng serve
   ```

The app will be available at `http://localhost:4200`.

---

## Frontend Usage

### Login
Navigate to `/authentication/login` and enter your credentials. On success, a JWT token is stored in `localStorage` and you are redirected to the dashboard.

### Navigation
Sidebar navigation items are filtered based on your role. Admin users see all sections. HR users see HR-related sections only. Employees only see their profile.

### Adding a User (Admin/HR)
Navigate to **Users → Add User**. Admins can assign any role. HR users can only assign the `Employee` role.

### Route Protection
Attempting to access a restricted route directly will redirect you to the `/unauthorized` page.

---

## Contributing

This project is currently in development. Suggestions and feedback are welcome.

