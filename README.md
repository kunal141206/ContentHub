# Personalized Content Tracker

A modern web application that delivers a personalized content feed by integrating news and entertainment APIs. Built using **Node.js**, **Express**, **TypeScript**, and **Vite**, this app allows users to configure their preferences and get curated content suggestions from sources like NewsAPI and TMDB.

---

## 🌐 Features

- 🔍 Personalized news feed based on category preferences
- 🎬 Movie recommendations from TMDB API
- 🧠 Smart caching and fast data retrieval using Redux Toolkit Query
- ⚡ Development experience powered by Vite
- 📦 Modular and scalable TypeScript backend

---

## 🏗️ Project Structure

```
root/
├── client/              # Frontend (Vite + React + TypeScript)
├── server/              # Backend (Express + TypeScript)
│   ├── routes/          # API routes for content delivery
│   ├── services/        # External API integrations
│   ├── utils/           # Utilities (logging, helpers)
│   └── index.ts         # Main entry point for server
├── public/              # Static assets
├── .env.example         # Example environment config
├── package.json         # Dependency config
└── README.md            # Project documentation
```

---

## ⚙️ Local Setup

### 1. Prerequisites

- Node.js (v18 or above)
- npm or yarn
- (Optional) PostgreSQL if required by external service

### 2. Clone the Repo

```bash
git clone https://github.com//personalized-content-tracker.git
cd personalized-content-tracker
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Environment Setup

Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
NEWS_API_KEY=your_newsapi_key
TMDB_API_KEY=your_tmdb_key
NODE_ENV=development
```

### 5. Run the App Locally

```bash
npm run dev
```

Access the app at: `http://localhost:5000`

---

## ☁️ Deployment

### 📌 Recommended Platforms

- [Render](https://render.com)


### Steps for Render Deployment

1. Push code to GitHub (omit `node_modules/`).
2. Go to [Render](https://render.com) and create a new Web Service.
3. Connect your GitHub repo.
4. Set environment variables from `.env`.
5. Use the following build & start commands:

```bash
Build Command: npm install && npm run build
Start Command: npm run start
```

---

## 🧪 Testing

This project uses basic endpoint logging. For deeper testing:

- Add unit tests using Jest for backend logic
- Use React Testing Library for frontend components

---

## 🧠 Future Improvements

- OAuth-based user authentication
- Full dark/light theme toggle
- Notification integration for trending news

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).