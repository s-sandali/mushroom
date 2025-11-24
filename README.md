# FungiFlow

A full-stack mushroom production management platform that coordinates laboratory batches, inventory, sales, and admin dashboards. The backend is a Spring Boot 3 application with session-based authentication, and the frontend is a React 18 single-page app.

## Project Layout

```
fungi/
├─ back/   # Spring Boot service (REST APIs, session auth, MySQL persistence)
└─ front/  # React SPA (role-aware dashboards and forms)
```

## Tech Stack

- Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA
- MySQL 8 (configurable via environment variables)
- React 18 (CRA), React Router, Axios, Bootstrap 5

## Prerequisites

- **JDK 21** installed and `JAVA_HOME` pointing to it (required because Maven compiles with `--release 21`).
- Node.js 18+ and npm 9+.
- Access to a MySQL 8 instance.
- (Optional) Git for version control.

## Backend Setup (`back/`)

1. Copy `back/src/main/resources/application.properties` and adjust for your environment, or provide environment variables:
   - `MYSQL_URL` (default `jdbc:mysql://mysql.railway.internal:3306/railway`)
   - `MYSQL_USERNAME`
   - `MYSQL_PASSWORD`
2. From `back/`, run the Spring Boot app:
   ```powershell
   cd back
   .\mvnw.cmd spring-boot:run
   ```
   Use `./mvnw spring-boot:run` on macOS/Linux.
3. The API listens on `http://localhost:8080`. Session cookies are `HttpOnly`/`SameSite=Lax`, so the frontend must call with `credentials: 'include'`.

### Common Backend Issues

- **`error: release version 21 not supported`** – install/configure a JDK 21 distribution, then verify with `java -version` and `mvn -v` before rerunning.
- **Database connectivity errors** – confirm the MySQL host is reachable and the credentials/environment variables are correct.

## Frontend Setup (`front/`)

1. Install dependencies:
   ```powershell
   cd front
   npm install
   ```
2. Start the development server:
   ```powershell
   npm start
   ```
3. The app runs on `http://localhost:3000` and proxies API calls to `http://localhost:8080`. Ensure the backend is running and that cookies are allowed.

## Authentication & Roles

The system uses session-based authentication with the following roles:
- `ADMIN` – full access to dashboards/reports.
- `LAB` – lab inventory, cultures, allocations.
- `INVENTORY` – raw materials, stock, suppliers.
- `SALES` – branches, sales orders, preorders.

Use the `/api/auth/signup` endpoint or the Signup page to create accounts tied to one of the above roles. Login requests must include the intended role so the backend can validate it matches.

## Recommended Next Steps

- Populate the MySQL database with seed data for labs, inventory, and sales modules.
- Configure HTTPS/Reverse proxy and secure cookie settings for production.
- Add automated tests (Spring Boot + React Testing Library) to cover critical flows.

Happy hacking! 🐚🍄
