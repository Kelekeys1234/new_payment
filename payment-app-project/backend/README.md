# Nehemiah Building Payment API (Spring Boot + MongoDB)

A Spring Boot 3 / Java 17 REST API that records member/worker registrations and payment
transactions, using MongoDB as the data store.

This package contains the **backend only**. It's a complete, runnable Spring Boot app you can
start locally or deploy straight to any host that gives you a Java 17 runtime and a MongoDB
connection string.

---

## 1. Requirements

- Java 17+ (`java -version`)
- Maven 3.9+ (or use the included setup below — no Maven wrapper is bundled, so install Maven
  locally: `brew install maven` / `apt install maven` / [maven.apache.org](https://maven.apache.org/download.cgi))
- A MongoDB database — any of the following work:
  - [MongoDB Atlas](https://www.mongodb.com/atlas) free tier (easiest for deployment)
  - A self-hosted MongoDB instance
  - `mongodb://localhost:27017` for local development

---

## 2. Project layout

```
backend/
├── pom.xml
├── src/main/java/com/example/payment/
│   ├── PaymentApplication.java
│   ├── config/            # WebConfig (CORS)
│   ├── controller/        # UserController, PaymentController, HealthController
│   ├── service/           # UserService, PaymentService
│   ├── repository/        # UserRepository, PaymentRepository (Spring Data MongoDB)
│   ├── util/              # SequenceGeneratorService (auto-incrementing IDs)
│   ├── dto/                # Request/response payloads
│   ├── model/              # User, Payment, Sequence, and enums
│   └── exception/          # GlobalExceptionHandler + custom exceptions
└── src/main/resources/application.yml
```

---

## 3. Configure the database connection

Only one environment variable is required:

```bash
export MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nehemiah_building"
```

For local development against a MongoDB running on your machine, you can skip this — it
defaults to `mongodb://localhost:27017/nehemiah_building`.

No credentials file, no manual collection/index setup — collections and indexes are created
automatically the first time the app writes to them.

---

## 4. Run it

```bash
cd backend
export MONGODB_URI="your-connection-string"   # skip for local Mongo on default port
mvn spring-boot:run
```

Confirm it's up:
```bash
curl http://localhost:8080/api/health
# {"status":"UP"}
```

The backend listens on **http://localhost:8080**.

---

## 5. Deploying

This is a standard Spring Boot jar, so it deploys the same way to Render, Railway, Fly.io,
an EC2/VM, a Docker container, etc.:

```bash
mvn clean package -DskipTests
java -jar target/nehemiah-building-payment-1.0.0.jar
```

Set `MONGODB_URI` (and optionally `PORT`/`SERVER_PORT`) as environment variables on whatever
platform you deploy to. Nothing else is required to boot — the app only needs a reachable
Mongo connection string at startup.

---

## 6. API overview

### Users (registration)
- `GET  /api/users` — list all registered users
- `GET  /api/users/{id}` — get a single user
- `GET  /api/users/{id}/summary` — user + aggregated payment totals
- `GET  /api/users/search?phone=...` — look up a user by phone number
- `POST /api/users` — register a new user. Body:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phoneNumber": "08012345678",
    "address": "12 Church Road, Lagos",
    "memberType": "MEMBER"   // or "WORKER"
  }
  ```

### Payments
- `GET  /api/payments` — list all payments
- `GET  /api/payments/{id}` — get a single payment
- `GET  /api/payments/user/{userId}` — payments for one user
- `GET  /api/payments/search?query=...` — search by payment id, name, or phone
- `POST /api/payments` — record a payment. If the phone number doesn't match an existing
  user, include `fullName` and a lightweight user record is created automatically.

### Health
- `GET /api/health` — liveness check, no database access required.
