# Task Manager

A full-stack task management application built with Angular 22, ASP.NET Core 9, Entity Framework Core, PostgreSQL, JWT authentication, and Playwright end-to-end tests.

The application is fully containerized. Run the complete stack with:

```bash
docker compose up --build
```

Open the application at [http://localhost:4200](http://localhost:4200).

## Features

- Create tasks with a title and priority
- View, update, and delete tasks
- Filter tasks by priority with Angular Signals
- JWT-based login and protected task routes
- Playwright browser automation tests for login and CRUD workflows
- Docker Compose support for the database, API, and frontend
- Kubernetes manifests for deployment
- Swagger/OpenAPI documentation in development

## Technology Stack

- Frontend: Angular 22, TypeScript, Angular Signals, Angular SSR, RxJS
- Backend: ASP.NET Core 9 Web API, Entity Framework Core
- Database: PostgreSQL 16
- Authentication: JWT Bearer tokens
- Testing: Vitest and Playwright
- Deployment: Docker, Docker Compose, Kubernetes

## Project Structure

```text
TaskManager/
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   ├── Dockerfile
│   └── TaskManager.Api.csproj
├── frontend/
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── playwright.config.ts
├── k8s/
│   ├── backend.yaml
│   ├── configmap.yaml
│   ├── frontend.yaml
│   ├── postgres.yaml
│   └── secret.yaml
├── .env.example
├── DECISIONS.md
├── docker-compose.yml
└── README.md
```

## Prerequisites

For the containerized workflow, install:

- Docker Desktop with Docker Compose

For local development, also install:

- .NET 9 SDK
- Node.js and npm
- Angular CLI, if you want to use the `ng` command directly
- PostgreSQL, unless you use the Compose database service

## Run Everything with Docker Compose

1. Create the environment file:

```bash
copy .env.example .env
```

On macOS or Linux, use:

```bash
cp .env.example .env
```

2. Update `.env` with your database credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=taskmanagerdb
```

3. Build and start all services from the repository root:

```bash
docker compose up --build
```

The services are exposed at:

| Service | URL or port |
| --- | --- |
| Frontend | [http://localhost:4200](http://localhost:4200) |
| Backend API | [http://localhost:5156](http://localhost:5156) |
| Swagger | [http://localhost:5156/swagger](http://localhost:5156/swagger) |
| PostgreSQL | `localhost:5432` |

Stop the stack with `Ctrl+C`, or run it in the background with:

```bash
docker compose up --build -d
```

To stop the containers:

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```

The backend container connects to PostgreSQL using the Compose service name `database`. The frontend is built as a static Angular application and served by Nginx.

## Authentication

The application has a public `/login` route and a protected `/tasks` route. Unauthenticated users are redirected to the login page.

Development login credentials:

```text
Email: admin@taskflow.com
Password: Admin@123
```

After login, the API returns a JWT. The frontend stores it in browser `localStorage` and sends it with task requests as a Bearer token. Tokens expire after one hour. Use the logout action to remove the token.

These credentials, the JWT signing key, and database password are development values only. Use a proper user store and secret management solution before production deployment.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/Tasks` | Get all tasks |
| `GET` | `/api/Tasks/{id}` | Get a task by ID |
| `POST` | `/api/Tasks` | Create a task |
| `PUT` | `/api/Tasks/{id}` | Update a task |
| `DELETE` | `/api/Tasks/{id}` | Delete a task |

Task endpoints require:

```http
Authorization: Bearer <jwt-token>
```

## Local Development

### Backend

```bash
cd backend
dotnet ef database update
dotnet run
```

The API runs at `http://127.0.0.1:5156` by default. Install Entity Framework CLI if required:

```bash
dotnet tool install --global dotnet-ef
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The frontend expects the API at `http://127.0.0.1:5156/api/Tasks`.

## Testing

Run Angular unit tests with Vitest:

```bash
cd frontend
npm test
```

The Playwright suite covers login/navigation and task create, read, update, and delete workflows. Start the backend and frontend first, then install browser binaries once:

```bash
cd frontend
npx playwright install
npx playwright test
```

Run headed tests or a specific browser project:

```bash
npx playwright test --headed
npx playwright test --project=chromium
npx playwright show-report
```

The Playwright configuration runs against Chromium, Firefox, and WebKit. Reports are written to `frontend/playwright-report/` and failure artifacts to `frontend/test-results/`.

## Kubernetes Deployment

The `k8s/` directory contains manifests for:

- PostgreSQL deployment and service
- Backend deployment and service
- Frontend deployment and LoadBalancer service
- Database ConfigMap
- Database Secret

Build the images first:

```bash
docker compose build
```

For a local Kubernetes cluster such as Minikube, load the images into the cluster when required:

```bash
minikube image load taskmanager-backend:latest
minikube image load taskmanager-frontend:latest
```

Apply the manifests:

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

Check the deployment status:

```bash
kubectl get pods
kubectl get services
```

The Kubernetes manifests use the image names `taskmanager-backend:latest` and `taskmanager-frontend:latest`. For a remote cluster, push those images to a registry and update the image names in the manifests.

## Documentation

- [DECISIONS.md](DECISIONS.md) describes the architecture, authentication strategy, containerization decisions, and future improvements.
- [frontend/src/app/README.md](frontend/src/app/README.md) contains additional application-specific notes.

## Common Commands

```bash
# Build the backend
dotnet build backend/TaskManager.Api.csproj

# Build the frontend
cd frontend
npm run build

# Build and start the complete stack
cd ..
docker compose up --build
```
