# Task Manager

A full-stack task management application built with Angular, ASP.NET Core, Entity Framework Core, and PostgreSQL.

## Features

 - Create tasks with a title and priority
 - View tasks loaded from the API
 - Mark tasks as `Todo` or `Done`
 - Delete tasks
 - Filter tasks by priority using Angular computed signals
 - Login with JWT-based authentication
 - Protect the task view and API requests with an auth guard and Bearer token
 - Playwright end-to-end automation tests for login and task CRUD
 - Swagger/OpenAPI documentation in development

## Technology Stack

### Frontend

 - Angular 22
 - TypeScript
 - Angular Signals
 - Angular SSR
 - RxJS

### Backend

 - ASP.NET Core 9 Web API
 - Entity Framework Core
 - PostgreSQL
 - JWT authentication
 - Swagger/OpenAPI

## Project Structure

```text
TaskManager/
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   ├── Program.cs
│   └── TaskManager.Api.csproj
├── frontend/
│   ├── src/
│   ├── tests/
│   │   └── app.spec.ts
│   ├── public/
│   ├── angular.json
│   ├── playwright.config.ts
│   └── package.json
└── docker-compose.yml
```

## Prerequisites

 - .NET 9 SDK
 - Node.js and npm
 - Docker Desktop, or a local PostgreSQL installation
 - Angular CLI, if you want to use the `ng` command directly

Install the Angular CLI globally when needed:

```bash
npm install -g @angular/cli
```

## Database Setup

The included Docker Compose file starts PostgreSQL 16.

Create a `.env` file in the project root:

```env
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=taskmanagerdb
```

Start PostgreSQL:

```bash
docker compose up -d database
```

Update the connection string in `backend/appsettings.json` to match your database credentials:

```json
{
	"ConnectionStrings": {
		"DefaultConnection": "Host=localhost;Database=taskmanagerdb;Username=postgres;Password=your_secure_password"
	}
}
```

Do not commit real passwords to source control.

## Run the Backend

From the project root:

```bash
cd backend
dotnet ef database update
dotnet run
```

The API runs at `http://127.0.0.1:5156` by default. Swagger is available at `http://127.0.0.1:5156/swagger`.

Install the Entity Framework CLI if required:

```bash
dotnet tool install --global dotnet-ef
```

## Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

The frontend expects the API at `http://127.0.0.1:5156/api/Tasks`.

## Automated Testing

The project uses [Playwright](https://playwright.dev/) for end-to-end browser testing. The current suite verifies:

- A user can log in and reach the protected task manager page
- The task manager displays the main heading and logout control
- A user can create, view, update, and delete a task

The tests run against the Angular development server at `http://localhost:4200` and use the development login account documented above. Start PostgreSQL, the backend API, and the frontend before running them.

From the `frontend` directory, install the Playwright browser binaries once:

```bash
npx playwright install
```

Run the full end-to-end suite across Chromium, Firefox, and WebKit:

```bash
npx playwright test
```

Run the tests in headed mode:

```bash
npx playwright test --headed
```

Run a specific browser project or test file:

```bash
npx playwright test --project=chromium
npx playwright test tests/app.spec.ts
```

Open the HTML test report after a run:

```bash
npx playwright show-report
```

Playwright stores reports in `playwright-report/` and failure artifacts in `test-results/`.

## Authentication

The application has a public `/login` route and a protected `/tasks` route. Unauthenticated users are redirected to the login page.

Use the development account to sign in:

```text
Email: admin@taskflow.com
Password: Admin@123
```

After a successful login, the API returns a JWT that the frontend stores in browser `localStorage`. The HTTP interceptor sends it with task requests using the `Authorization: Bearer <token>` header. Tokens expire after one hour. Use the logout action to remove the token and return to the login page.

These credentials and the JWT signing key in `backend/appsettings.json` are development-only values. Replace them with a proper user store and a secret managed through environment variables or a secret manager before deploying the application.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/Tasks` | Get all tasks |
| `GET` | `/api/Tasks/{id}` | Get a task by ID |
| `POST` | `/api/Tasks` | Create a task |
| `PUT` | `/api/Tasks/{id}` | Update a task |
| `DELETE` | `/api/Tasks/{id}` | Delete a task |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |

### Login Request

```json
{
	"email": "admin@taskflow.com",
	"password": "Admin@123"
}
```

Successful authentication returns:

```json
{
	"token": "<jwt-token>"
}
```

Task endpoints require the token in the request header:

```http
Authorization: Bearer <jwt-token>
```

### Task Model

```json
{
	"id": 1,
	"title": "Example task",
	"description": "Task details",
	"priority": "Medium",
	"dueDate": null,
	"status": "Todo"
}
```

Supported priorities are `Low`, `Medium`, and `High`. Supported statuses are `Todo` and `Done`.

## Common Commands

### Frontend

```bash
ng serve        # Start the development server
npm build        # Create a production build
```

### Backend

```bash
dotnet restore              # Restore NuGet packages
dotnet build                # Build the API
dotnet run                  # Start the API
dotnet ef database update   # Apply migrations
```

## Troubleshooting

### The frontend cannot load tasks

Check that PostgreSQL and the backend are running, the connection string is correct, and the frontend API URL matches the backend URL.

### CORS errors

The backend allows requests from `http://localhost:4200` and `http://127.0.0.1:4200`. Open the frontend using one of these URLs.