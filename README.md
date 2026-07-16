# 🎮 Pokédex Game

<div align="center">

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/Battle-FastAPI-009688?logo=fastapi&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Database-Docker-2496ED?logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?logo=railway)

### ⚡ A Full Stack Pokémon Battle Game with Authentication, Pokédex, Multiplayer Chat, and Turn-Based Battle System

</div>

---

# 🌐 Live Demo

### 🎮 Frontend

👉 **https://pokedex-game-blond.vercel.app**

---

### ⚙️ Backend API (Node.js)

👉 **https://unique-achievement-production-6621.up.railway.app**

---

### ⚔️ Battle Logic Service (FastAPI)

👉 **https://considerate-alignment-production-2d97.up.railway.app**

---

# 📖 Project Overview

Pokédex Game is a **full-stack Pokémon-inspired web application** where users can register, log in, choose a starter Pokémon, explore the Pokédex, battle NPC trainers using turn-based combat, and communicate with nearby players through a multiplayer chat system.

The project follows a **microservice architecture** by separating authentication/game management and battle calculations into independent backend services.

---

# ✨ Features

## 👤 Authentication

- Secure User Registration
- JWT Authentication
- Login / Logout
- Session Validation
- Protected Routes

---

## 🎮 Gameplay

- Choose one starter Pokémon
  - 🌱 Bulbasaur
  - 🔥 Charmander
  - 💧 Squirtle

- Trainer Progression
- NPC Battles
- Boss Battles
- HP Tracking
- Experience System
- Level Progression

---

## ⚔️ Battle System

- Turn-based battle engine
- Speed-based turn order
- Damage calculation
- Critical Hits
- Type Effectiveness
- Move Accuracy
- Status Effects
- Healing Moves
- Multi-hit Moves

---

## 📚 Pokédex

- Pokémon Search
- Pokémon Details
- Stats
- Types
- Official Artwork
- Responsive UI

---

## 💬 Multiplayer Ground

- Real-time Chat
- Nearby Player Detection
- Socket.IO Communication
- Player Movement
- Live User Positions

---

## 🗄 Database

- Trainer Management
- Pokémon Storage
- Battle Progress
- Move Storage
- Authentication

---

# 🏗 Architecture

```text
                React + Vite
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼

 Node.js Backend          Python FastAPI
(Authentication)          (Battle Engine)

        │                         │
        └────────────┬────────────┘
                     │
                  MySQL
                 (Docker)
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- MySQL

---

## Battle Engine

- Python
- FastAPI
- Pydantic

---

## Database

- MySQL
- Docker

---

## Deployment

- Vercel
- Railway
- GitHub

---

# 📂 Project Structure

```text
Pokedex-Game
│
├── frontend
│   ├── components
│   ├── pages
│   ├── assets
│   └── App.jsx
│
├── backend
│   ├── routes
│   ├── config
│   ├── database
│   └── server.js
│
├── battle-logic-service
│   ├── level1.py
│   ├── main.py
│   ├── models.py
│   ├── utils.py
│   └── level1.json
│
└── docker-compose.yml
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/himanshusinghpatel998/pokedex-game.git

cd pokedex-game
```

---

## Start MySQL

```bash
docker-compose up -d
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Battle Service

```bash
cd battle-logic-service

pip install -r requirements.txt

python main.py
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🌍 Environment Variables

## Backend

Create a `.env` file:

```env
JWT_SECRET=your_secret_key

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trainer
```

---

# 🚀 Deployment

### Frontend

- Vercel

### Backend

- Railway

### Battle Service

- Railway

### Database

- Docker + MySQL

---

# 📡 API Endpoints

## Authentication

```
POST /api/register

POST /api/login

GET /api/validate
```

---

## Game

```
POST /api/choose-starter

GET /trainer/:id/data
```

---

## Battle Service

```
GET /level/1

POST /simulate_battle/

POST /calculate_damage/

POST /turn_order/

POST /add_experience/
```

---

# 🎮 Gameplay Flow

```text
Register
      │
      ▼
Login
      │
      ▼
Choose Starter Pokémon
      │
      ▼
Enter Game
      │
      ▼
Explore Ground
      │
      ▼
Battle NPC Trainers
      │
      ▼
Gain Experience
      │
      ▼
Fight Boss
```

---

# 📸 Screenshots

> Add screenshots here.

- Login Page
- Registration Page
- Starter Selection
- Pokédex
- Battle Screen
- Chat Ground
- Battle Victory

---

# 🔮 Future Enhancements

- PvP Battles
- Pokémon Evolution
- Inventory System
- Items
- Trading
- Multiple Levels
- Save Battle History
- Leaderboards
- Pokémon Capture System

---

# 👨‍💻 Author

**Himanshu Singh Patel**

GitHub:
https://github.com/himanshusinghpatel998

---

# ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future improvements.

---

# 📜 License

This project is developed for educational and learning purposes.