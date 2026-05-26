# CloudOps Core API

Backend microservice for **CloudOps Lab**, built with Node.js, Express, Docker, Docker Compose, and deployed on DigitalOcean App Platform.

This service represents the core API of the CloudOps Lab platform and is part of a practical DevOps/cloud architecture project focused on containers, environment configuration, health checks, CORS, basic observability, and cloud deployment.

---

## Tech Stack

- Node.js
- Express.js
- CORS
- Docker
- Docker Compose
- DigitalOcean App Platform
- GitHub

---

## Project Structure

```bash
core-api/
├── Dockerfile
├── .dockerignore
├── .env                 # Local only, not committed
├── .env.example         # Safe template, committed
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check endpoint |
| GET | `/status` | Service status endpoint |
| POST | `/test` | Test endpoint for receiving JSON data |

---

## Public Deployment

The API is deployed on **DigitalOcean App Platform**.

Base URL:

```bash
https://whale-app-6iffy.ondigitalocean.app
```

Public endpoints:

```bash
https://whale-app-6iffy.ondigitalocean.app/health
https://whale-app-6iffy.ondigitalocean.app/status
https://whale-app-6iffy.ondigitalocean.app/test
```

Test public health endpoint:

```bash
curl https://whale-app-6iffy.ondigitalocean.app/health
```

Test public status endpoint:

```bash
curl https://whale-app-6iffy.ondigitalocean.app/status
```

Expected response:

```json
{
  "service": "core-api",
  "status": "running"
}
```

---

## Environment Variables

Create a local `.env` file based on `.env.example`.

```bash
cp .env.example .env
```

Example `.env`:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

The `.env` file is ignored by Git and should not be committed.

The `.env.example` file is committed because it documents which variables the service needs.

---

## Environment Variables in DigitalOcean

In DigitalOcean App Platform, environment variables are configured from the platform.

Current production variables:

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://cloudops-portal.vercel.app,https://cloudops-portal-git-main-cloud-ops-lab.vercel.app
```

If additional Vercel preview URLs are used, they can be added to `ALLOWED_ORIGINS`, separated by commas.

Example:

```env
ALLOWED_ORIGINS=https://cloudops-portal.vercel.app,https://cloudops-portal-git-main-cloud-ops-lab.vercel.app,https://another-preview-url.vercel.app
```

Do not add spaces after commas.

---

## CORS Configuration

The API uses CORS to control which frontend origins are allowed to consume the backend from a browser.

Instead of allowing all origins with:

```js
app.use(cors());
```

the service uses an allowlist through the `ALLOWED_ORIGINS` environment variable:

```js
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  }
}));
```

This means:

- Local frontend can consume the API from `http://localhost:3000`
- Production frontend can consume the API from Vercel
- Unknown browser origins are rejected by CORS

Important: CORS is not authentication. It controls browser-based cross-origin access, but it does not prevent direct requests with tools like `curl` or Postman.

---

## Request Logging

The API includes a basic Express middleware to log incoming requests:

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

Example logs:

```bash
GET /health
GET /status
POST /test
```

Logs are written to stdout. Docker, Docker Compose, and DigitalOcean capture those logs.

---

## Run Locally

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The API runs on:

```bash
http://localhost:3000
```

Test locally:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/status
```

---

## Run with Docker

Build the Docker image:

```bash
docker build -t core-api:dev .
```

Run the container:

```bash
docker run --name core-api-container -p 4000:3000 core-api:dev
```

The API will be available at:

```bash
http://localhost:4000
```

---

## Run with Docker Compose

From the root `cloud-ops-lab/` directory:

```bash
docker compose up -d
```

Check container status:

```bash
docker ps
```

Expected status:

```bash
Up ... (healthy)
```

View logs:

```bash
docker compose logs -f core-api
```

Stop services:

```bash
docker compose down
```

---

## Docker Healthcheck

The service includes a Docker Compose healthcheck that validates:

```bash
http://localhost:3000/health
```

Inside the container, the API listens on port `3000`.

The local machine maps:

```bash
localhost:4000 -> container:3000
```

The healthcheck runs inside the container, so it uses the internal port `3000`, not the external port `4000`.

---

## Test the API

Health check:

```bash
curl http://localhost:4000/health
```

Status:

```bash
curl http://localhost:4000/status
```

POST test:

```bash
curl -X POST http://localhost:4000/test \
  -H "Content-Type: application/json" \
  -d '{"message":"testing core api"}'
```

Public DigitalOcean test:

```bash
curl https://whale-app-6iffy.ondigitalocean.app/status
```

---

## Deployment Flow

Current deployment flow:

```bash
GitHub repo
  ↓
DigitalOcean App Platform
  ↓
Dockerfile build
  ↓
core-api public web service
```

DigitalOcean is configured with automatic deployment from the `main` branch.

When changes are pushed to GitHub:

```bash
git push
```

DigitalOcean automatically rebuilds and redeploys the backend.

---

## Frontend Integration

This backend is consumed by the frontend repository:

```bash
https://github.com/Darkreach2023/cloudops-portal
```

The frontend uses this environment variable:

```env
NEXT_PUBLIC_CORE_API_URL=https://whale-app-6iffy.ondigitalocean.app
```

In local development, the frontend can use:

```env
NEXT_PUBLIC_CORE_API_URL=http://localhost:4000
```

---

## Repository

This repository is part of the **CloudOps Lab** project.

Frontend repository:

```bash
https://github.com/Darkreach2023/cloudops-portal
```

Backend repository:

```bash
https://github.com/Darkreach2023/cloudops-core-api
```

---

## Author

Developed by **César Ramírez** as part of a personal DevOps, cloud architecture, and microservices lab.