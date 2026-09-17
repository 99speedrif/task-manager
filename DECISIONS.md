# Architecture and Design Decisions

This document outlines the high-level technical decisions, architectural patterns, and trade-offs made during the development of the Task Manager application.

## 1. Tech Stack Selection
*   **Backend (ASP.NET Core 9 & C#):** Chosen for its high performance, robust built-in Dependency Injection, and seamless integration with Entity Framework Core. The strictly typed nature of C# ensures enterprise-level reliability for the API.
*   **Frontend (Angular 22):** Selected for its structured, component-based architecture. We utilized **Angular Signals** for reactive state management, moving away from heavy RxJS boilerplate for standard CRUD operations to improve readability and performance.
*   **Database (PostgreSQL):** A powerful, open-source relational database. Chosen over NoSQL (like MongoDB) because task data is inherently relational and structured (Tasks, Users, Statuses).
*   **Testing (Playwright):** Chosen over Cypress or Selenium because it offers blazing-fast, cross-browser End-to-End (E2E) testing and a superior developer experience with its UI mode.

## 2. Authentication Strategy
We implemented **JWT (JSON Web Tokens)** for stateless authentication. 
*   *Decision:* The backend generates a token upon login, which the frontend stores locally and attaches to subsequent requests via an HTTP Interceptor. 
*   *Trade-off:* While HTTP-only cookies are slightly more secure against XSS, Local Storage with Bearer tokens is the industry standard for decoupled SPA-to-API architectures and simplifies cross-origin resource sharing (CORS).

## 3. Deployment & Containerization
*   *Decision:* We used Docker (via `docker-compose`) for local development to ensure parity across environments. For production, Kubernetes (k8s) manifests are provided to orchestrate the containers, allowing the frontend and backend to scale independently based on load.

## 4. Future Improvements
If given more time, the following enhancements would be prioritized:
1.  **Secret Management:** Move the JWT Secret and Database Connection strings out of environment files and into a secure vault (e.g., Azure Key Vault or Kubernetes Secrets).
2.  **Pagination:** Implement server-side pagination in the API and frontend to handle scaling when the task list grows to thousands of records.