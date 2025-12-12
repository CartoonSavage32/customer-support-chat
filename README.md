# ViralLens – AI Customer Support Chat

ViralLens is a full-stack AI customer support chat application. Users can sign up, log in, chat with an AI assistant, and return later to see their saved chat history. The backend handles authentication, message storage, and AI integration, while the frontend provides a simple chat interface.

---

## Features

- JWT-based authentication (signup, login, logout)
- Password hashing using bcrypt
- AI-generated responses using OpenRouter
- User-specific chat history stored in MongoDB
- Protected API routes
- Typing indicator for better UX
- Rate-limited endpoints for security
- Docker support for running everything with one command

---

## Tech Stack

**Frontend:** React (Vite)  
**Backend:** Node.js + Express  
**Database:** MongoDB (Atlas)  
**AI Provider:** OpenRouter.ai  
**Authentication:** JWT + bcrypt  
**DevOps:** Docker, Docker Compose

---

## Getting Started (Local)

### 1. Clone the repository

```bash
git clone https://github.com/CartoonSavage32/customer-support-chat
cd virallens
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
```

Create `.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

**Frontend → http://localhost:3000**  
**Backend → http://localhost:5000**

---

## Running with Docker

Create a `.env` file in the project root:

```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

Start everything:

```bash
docker-compose up --build
```

Frontend will be available at **http://localhost:3000**.

---

## API Endpoints

### Authentication

- **POST /api/auth/signup** - Creates a new user.
- **POST /api/auth/login** - Returns a JWT token for authenticated access.

### Chat

- **POST /api/chat/send** - Sends a user message and returns an AI response.
- **GET /api/chat/history** - Returns chat history for the logged-in user.

---

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing key |
| `OPENROUTER_API_KEY` | API key for OpenRouter |
| `OPENROUTER_MODEL` | Model ID to use |
| `PORT` | Backend port (optional) |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL for backend API |

---

## Project Structure

```
virallens/
│
├── client/
│   ├── src/
│   │   ├── components/        # Login, Signup, Chat UI
│   │   ├── utils/             # Token management, axios setup
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── server/
│   ├── routes/                # auth.js, chat.js
│   ├── models/                # User.js, Chat.js
│   ├── middleware/            # auth.js, rateLimiter.js
│   ├── services/              # aiService.js
│   ├── Dockerfile
│   └── server.js
│
├── docker-compose.yml
└── README.md
```

---

## Troubleshooting

- **MongoDB connection errors:** Check IP whitelist and connection string.
- **AI provider errors:** Ensure model name and API key are valid.
- **CORS issues:** Verify `VITE_API_URL` and backend CORS config.

---

## License

ISC
