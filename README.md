# 🚀 Task Manager Frontend

A modern, high-performance task management interface built with **Angular 21**. This project is fully containerized with **Docker** and optimized for production using **Nginx** as a reverse proxy to bridge cross-environment communication.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Angular 21** | Frontend Framework (Standalone Components) |
| **Vitest** | High-performance Unit Testing & Mocking |
| **Docker** | Containerization for consistent environments |
| **Nginx** | Production Web Server & API Reverse Proxy |

---

## 🏗 System Architecture

This project implements a sophisticated **Cross-Environment Bridge**. It allows the Frontend (running in **WSL/Linux**) to communicate seamlessly with the Backend (running in **Windows via Laravel Sail**).



### Key Infrastructure Highlights:
* **Nginx Reverse Proxy**: Configured to route all `/api/*` traffic to the backend service, effectively bypassing CORS limitations.
* **Multi-stage Build**: Utilizes Node 20 for building and Nginx Alpine for serving, ensuring a minimal production image footprint.
* **Docker Networking**: Integrated with external Sail networks to ensure container-to-container connectivity across OS boundaries.

---

## ✨ Features

* **Dynamic Task Board**: Real-time task listing with status indicators (Pending, In Progress, Completed).
* **Debounced API Search**: High-performance dashboard search that optimizes server load by debouncing API calls.
* **Task Attachments**: Seamless support for adding and managing file attachments directly within tasks.
* **Smart Commenting**: A full comment system that automatically toggles visibility based on the task's state.
* **Robust Testing**: 100% logic coverage using Vitest, featuring advanced global mocks for `localStorage` and `URL` constructors.
* **Production Ready**: Zero-config deployment via Docker Compose.

---

## 🚀 Getting Started

### Prerequisites
* Docker & Docker Compose
* Laravel Backend (Sail) running on the same host

### Installation
1. Clone the repository to your local machine.
2. Navigate to the project directory in your WSL terminal:
   ```bash
   cd task-manager-frontend
2. Spin up the containerized environment:
   ```bash
   docker compose up --build -d
3. Access the application at http://localhost:4200.

---

## 🧪 Development & Testing

- Navigate to the project directory in your WSL terminal:
   ```bash
   npm test

*Tests include: Authentication flows, Task CRUD operations, and Comment logic.*

---

## 👨‍💻 Engineering Insights
This project demonstrates expertise in:
- Advanced DevOps: Solving WSL DNS resolution and Docker networking challenges.
- State Management: Handling asynchronous data streams with RxJS in Angular.
- Security: Implementing Nginx headers for secure production serving.

---

*Developed with focus on scalability and clean code.*