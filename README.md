# CloudOps Lab

Laboratorio práctico de arquitectura cloud, DevOps, microservicios y despliegue moderno.

**CloudOps Lab** es un proyecto personal diseñado para simular una plataforma tipo producción, donde se integran frontend, backend, contenedores, automatización, observabilidad y despliegue cloud.

Actualmente el proyecto está dividido en dos componentes principales:

```bash
cloud-ops-lab/
├── cloudops-portal/      # Frontend Next.js
├── core-api/             # Backend Node.js + Express
└── docker-compose.yml    # Orquestación local con Docker Compose
```

---

## 📌 Descripción del proyecto

El objetivo de **CloudOps Lab** es aprender y dominar arquitectura cloud y DevOps mediante práctica real, construyendo una plataforma progresiva con enfoque profesional.

El proyecto busca cubrir conceptos como:

- Arquitectura basada en microservicios
- Frontend desacoplado
- Backend con Node.js y Express
- Contenedores con Docker
- Orquestación local con Docker Compose
- Variables de entorno
- Logs básicos de aplicación
- CI/CD
- Kubernetes
- Observabilidad
- Seguridad básica DevSecOps
- Infraestructura como código

---

## 🏗️ Estructura general del laboratorio

```bash
cloud-ops-lab/
├── cloudops-portal/
│   └── Frontend construido con Next.js
│
├── core-api/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── package-lock.json
│   └── index.js
│
└── docker-compose.yml
```

---

## 🚀 Estado actual

### Frontend — `cloudops-portal`

- Aplicación creada con Next.js
- Proyecto conectado a GitHub
- Despliegue inicial en Vercel
- Base lista para construir el dashboard CloudOps

### Backend — `core-api`

- Microservicio creado con Node.js + Express
- API funcional localmente
- Contenerizado con Docker
- Ejecutado correctamente mediante Docker Compose
- Variables de entorno configuradas desde `docker-compose.yml`
- Middleware básico de logging implementado con `console.log`

Endpoints disponibles:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Verifica que la API esté funcionando |
| GET | `/status` | Devuelve el estado del servicio |
| POST | `/test` | Recibe datos JSON de prueba |

---

## 🧱 Stack tecnológico

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint
- Vercel

### Backend

- Node.js
- Express.js

### DevOps / Cloud

- Git
- GitHub
- Docker
- Docker Compose
- Vercel
- Kubernetes, próximamente
- DigitalOcean, próximamente
- Terraform, próximamente
- Ansible, próximamente
- Observabilidad, próximamente

---

## 🐳 Dockerización de `core-api`

El backend `core-api` ya cuenta con:

```bash
core-api/
├── Dockerfile
└── .dockerignore
```

### Imagen Docker

La imagen de desarrollo se construye con el tag:

```bash
core-api:dev
```

Comando manual para construir la imagen desde `core-api/`:

```bash
docker build -t core-api:dev .
```

### Ejecutar manualmente el contenedor

```bash
docker run --name core-api-container -p 4000:3000 core-api:dev
```

Esto significa:

```bash
localhost:4000  ->  contenedor:3000
```

La API queda disponible en:

```bash
http://localhost:4000
```

---

## 🧩 Docker Compose

El proyecto ya cuenta con un archivo `docker-compose.yml` en la raíz:

```bash
cloud-ops-lab/docker-compose.yml
```

Configuración actual:

```yaml
services:
  core-api:
    build:
      context: ./core-api
      dockerfile: Dockerfile
    image: core-api:dev
    container_name: core-api-container
    ports:
      - "4000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=development
    restart: unless-stopped
```

### ¿Qué hace este archivo?

- Construye la imagen usando `core-api/Dockerfile`
- Asigna el tag `core-api:dev`
- Crea el contenedor `core-api-container`
- Mapea el puerto `4000` de la máquina local al puerto `3000` del contenedor
- Inyecta variables de entorno al contenedor
- Reinicia el servicio automáticamente salvo que se detenga manualmente

---

## ⚙️ Variables de entorno

El puerto interno del backend ya no está fijo directamente en el código.

En `index.js` se utiliza:

```js
const PORT = process.env.PORT || 3000;
```

Y desde `docker-compose.yml` se inyecta:

```yaml
environment:
  - PORT=3000
  - NODE_ENV=development
```

Esto permite separar la configuración del código.

### Diferencia importante

```bash
PORT=3000
```

Define el puerto interno donde Express escucha dentro del contenedor.

```yaml
ports:
  - "4000:3000"
```

Mapea el puerto `4000` de la máquina local hacia el puerto `3000` del contenedor.

---

## 📋 Middleware de logs

Se agregó un middleware básico para registrar cada petición HTTP que llega a la API:

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

Este middleware permite observar en logs qué endpoints están siendo consumidos.

Ejemplo:

```bash
GET /health
GET /status
POST /test
```

Los logs no se guardan en un archivo dentro del proyecto.  
`console.log` escribe en la salida estándar del proceso Node.js y Docker captura esa salida.

Se pueden consultar con:

```bash
docker compose logs -f core-api
```

O directamente con el nombre del contenedor:

```bash
docker logs -f core-api-container
```

---

## ▶️ Comandos principales con Docker Compose

Todos estos comandos deben ejecutarse desde la raíz del proyecto:

```bash
cd cloud-ops-lab
```

### Levantar el proyecto

```bash
docker compose up
```

### Levantar en segundo plano

```bash
docker compose up -d
```

### Reconstruir imagen y levantar contenedor

Usar cuando cambia el código, el `Dockerfile` o dependencias:

```bash
docker compose down
docker compose up --build
```

O en segundo plano:

```bash
docker compose down
docker compose up -d --build
```

### Ver servicios activos

```bash
docker compose ps
```

### Ver logs del servicio

```bash
docker compose logs -f core-api
```

### Ver últimas líneas de logs

```bash
docker compose logs --tail=30 -f core-api
```

### Detener sin borrar contenedores

```bash
docker compose stop
```

### Volver a iniciar contenedores detenidos

```bash
docker compose start
```

### Detener y borrar contenedores/red de Compose

```bash
docker compose down
```

---

## 🧠 Conceptos aprendidos

Durante esta fase se reforzaron conceptos clave de Docker:

### Imagen

Una imagen es una plantilla construida a partir del `Dockerfile`.

Ejemplo:

```bash
core-api:dev
```

### Contenedor

Un contenedor es una instancia en ejecución de una imagen.

Ejemplo:

```bash
core-api-container
```

### Dockerfile

Define cómo construir la imagen del backend.

### `.dockerignore`

Define qué archivos no deben entrar al contexto de construcción de Docker.

### Docker Compose

Permite definir y ejecutar servicios desde un archivo YAML, evitando escribir manualmente todos los comandos `docker build` y `docker run`.

### Variables de entorno

Permiten separar configuración del código.

### Logs

La aplicación escribe logs con `console.log`, Docker los captura y se consultan con `docker compose logs`.

---

## 🧪 Pruebas de API

Con el contenedor levantado, probar:

### Health check

```bash
curl http://localhost:4000/health
```

### Status

```bash
curl http://localhost:4000/status
```

### POST test

```bash
curl -X POST http://localhost:4000/test \
  -H "Content-Type: application/json" \
  -d '{"message":"testing from docker compose"}'
```

---

## 🌐 Deploy

Frontend desplegado en Vercel:

```bash
https://cloudops-portal.vercel.app/
```

---

## ⚙️ Instalación local del frontend

Clonar el repositorio:

```bash
git clone https://github.com/Darkreach2023/cloudops-portal.git
```

Entrar al proyecto:

```bash
cd cloudops-portal
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Abrir en el navegador:

```bash
http://localhost:3000
```

---

## 📂 Scripts disponibles del frontend

Ejecutar entorno de desarrollo:

```bash
npm run dev
```

Construir aplicación para producción:

```bash
npm run build
```

Ejecutar aplicación en modo producción:

```bash
npm run start
```

Ejecutar revisión de código:

```bash
npm run lint
```

---

## 🎯 Roadmap del proyecto

### Fase 1 — Base del proyecto

- Crear frontend con Next.js
- Conectar repositorio a GitHub
- Desplegar frontend en Vercel
- Crear backend base con Node.js + Express

Estado: completado parcialmente.

### Fase 2 — Docker

- Crear Dockerfile para `core-api`
- Crear `.dockerignore`
- Construir imagen Docker del backend
- Ejecutar microservicio en contenedor
- Agregar Docker Compose
- Configurar variables de entorno
- Agregar logs básicos por request
- Preparar entorno local reproducible

Estado: en progreso avanzado.

### Fase 3 — Microservicios

- Separar servicios por dominio
- Crear servicio de usuarios
- Crear servicio de autenticación
- Implementar API Gateway básico

### Fase 4 — Cloud

- Desplegar servicios en DigitalOcean
- Crear cluster Kubernetes con DOKS
- Configurar Load Balancer
- Preparar manifiestos Kubernetes

### Fase 5 — DevOps real

- Implementar CI/CD completo
- Automatizar despliegues
- Configurar logs y métricas
- Agregar monitoreo
- Manejar variables de entorno y secretos
- Añadir prácticas básicas de DevSecOps

---

## 🧭 Próximos pasos técnicos

Siguientes mejoras recomendadas:

- Agregar `healthcheck` en `docker-compose.yml`
- Crear archivo `.env` para variables de entorno
- Mejorar logs con formato estructurado
- Documentar arquitectura inicial
- Preparar `docker-compose` para múltiples servicios
- Agregar base de datos en contenedor
- Preparar primer microservicio adicional

---

## 🧑‍💻 Perfil profesional objetivo

Este proyecto está orientado a desarrollar habilidades para roles como:

- DevOps Engineer
- Cloud Engineer
- Site Reliability Engineer
- Backend Engineer
- Platform Engineer
- Cloud Security Engineer

El enfoque principal es construir una plataforma realista, escalable y mantenible, aplicando buenas prácticas de arquitectura de software, operación cloud y automatización.

---
##healthcheck
.env
.env.example
env_file
variable fuera de YAML

## 📌 Repositorios relacionados

Frontend:

```bash
https://github.com/Darkreach2023/cloudops-portal
```
## Backend Integration

The frontend connects to the Core API using the following environment variable:

```env
NEXT_PUBLIC_CORE_API_URL=http://localhost:4000

Backend:

```bash
core-api
```

---

## 👨‍💻 Autor

Proyecto desarrollado por **César Ramírez** como parte de su laboratorio personal de arquitectura cloud, DevOps y microservicios.



# CloudOps Core API

Main backend microservice for **CloudOps Lab**, built with Node.js, Express, Docker, Docker Compose, and deployed on DigitalOcean App Platform.

This service represents the main API of the CloudOps Lab platform and is part of a practical cloud architecture, DevOps, and microservices lab focused on containers, environment variables, health checks, CORS, basic observability, cloud deployment, and service-to-service integration.

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
| GET | `/health` | Checks if the API is running |
| GET | `/status` | Returns the service status |
| POST | `/test` | Receives test JSON data |
| GET | `/users-summary` | Calls `users-api` internally and returns a user summary |

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

> Note: the `/users-summary` endpoint currently works locally with Docker Compose because `core-api` and `users-api` run in the same internal Docker network. For this endpoint to work in cloud, `users-api` must also be deployed and `USERS_API_URL` must be configured in DigitalOcean.

---

## Environment Variables

Create a local `.env` file based on `.env.example`.

```bash
cp .env.example .env
```

Example local `.env`:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
USERS_API_URL=http://users-api:3001
```

The `.env` file is ignored by Git and must not be committed.

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

When `users-api` is deployed to DigitalOcean, this variable must also be added to `core-api`:

```env
USERS_API_URL=https://PUBLIC-USERS-API-URL
```

Future example:

```env
USERS_API_URL=https://cloudops-users-api.ondigitalocean.app
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

- The local frontend can consume the API from `http://localhost:3000`
- The production frontend can consume the API from Vercel
- Unknown browser origins are rejected by CORS

Important: CORS is not authentication. It controls browser-based cross-origin access, but it does not prevent direct requests with tools such as `curl`, Postman, or other HTTP clients.

---

## Users API Integration

`core-api` communicates internally with `users-api` through Docker Compose.

The endpoint exposed by `core-api` to retrieve summarized user information is:

```bash
GET /users-summary
```

Local test:

```bash
curl http://localhost:4000/users-summary
```

Expected response:

```json
{
  "service": "core-api",
  "source": "users-api",
  "usersCount": 2,
  "users": [
    {
      "id": 1,
      "name": "Cesar Ramirez",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "CloudOps User",
      "role": "viewer"
    }
  ]
}
```

The internal microservice URL is configured through the following environment variable:

```env
USERS_API_URL=http://users-api:3001
```

Inside Docker Compose, services communicate using the service name defined in `docker-compose.yml`, not `localhost`.

```bash
core-api -> http://users-api:3001/users -> users-api
```

From the host machine, services are accessed through the mapped ports:

```bash
core-api  -> http://localhost:4000
users-api -> http://localhost:4001
```

Important difference:

```bash
localhost:4000   # Host machine access to core-api
localhost:4001   # Host machine access to users-api
users-api:3001   # Internal Docker Compose service-to-service communication
```

The `/users-summary` endpoint works locally because `core-api` and `users-api` run inside the same Docker Compose network.

In cloud, for `/users-summary` to work in production, `users-api` must be deployed as another service and `USERS_API_URL` must point to the public or internal URL of that service.

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
GET /users-summary
POST /test
```

Logs are written to `stdout`. Docker, Docker Compose, and DigitalOcean capture that output.

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

Test locally without Docker:

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
docker compose up -d --build
```

Check running containers:

```bash
docker ps
```

Expected status:

```bash
core-api-container    Up ... (healthy)
users-api-container   Up ... (healthy)
```

View `core-api` logs:

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
http://127.0.0.1:3000/health
```

Inside the container, the API listens on port `3000`.

The host machine maps:

```bash
localhost:4000 -> container:3000
```

The healthcheck runs inside the container, so it uses the internal port `3000`, not the external port `4000`.

---

## Test the API

Local health check through Docker:

```bash
curl http://localhost:4000/health
```

Local status through Docker:

```bash
curl http://localhost:4000/status
```

POST test:

```bash
curl -X POST http://localhost:4000/test \
  -H "Content-Type: application/json" \
  -d '{"message":"testing core api"}'
```

Local users summary:

```bash
curl http://localhost:4000/users-summary
```

Public DigitalOcean test:

```bash
curl https://whale-app-6iffy.ondigitalocean.app/status
```

---

## Deployment Flow

Current deployment flow for `core-api`:

```bash
GitHub repository
  ↓
DigitalOcean App Platform
  ↓
Dockerfile build
  ↓
core-api as a public web service
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

## Related Repositories

This repository is part of the **CloudOps Lab** project.

Frontend:

```bash
https://github.com/Darkreach2023/cloudops-portal
```

Core API:

```bash
https://github.com/Darkreach2023/cloudops-core-api
```

Users API:

```bash
https://github.com/Darkreach2023/cloudops-users-api
```

---

## Author

Developed by **César Ramírez** as part of a personal DevOps, cloud architecture, and microservices lab.
