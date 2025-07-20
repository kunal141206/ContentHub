# Local Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** package manager
3. **API Keys** (same ones you used on Replit):
   - NewsAPI Key from [newsapi.org](https://newsapi.org/register)
   - TMDB API Key from [themoviedb.org](https://www.themoviedb.org/settings/api)

## Quick Start

### Method 1: Direct Node.js Deployment (Recommended)

1. **Download the project files** to your local machine

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file** with your API keys:
   ```
   NEWSAPI_KEY=your_actual_newsapi_key_here
   TMDB_API_KEY=your_actual_tmdb_key_here
   NODE_ENV=production
   PORT=3000
   ```

5. **Build and start the application**
   ```bash
   npm run build
   npm start
   ```

6. **Open your browser** and go to `http://localhost:3000`

### Method 2: Docker Deployment

1. **Install Docker** on your machine

2. **Create .env file** with your API keys (same as Method 1)

3. **Build and run with Docker**
   ```bash
   docker build -t content-dashboard .
   docker run -p 3000:3000 --env-file .env content-dashboard
   ```

4. **Or use Docker Compose**
   ```bash
   docker-compose up --build
   ```

## Development Mode (Optional)
To run in development mode with hot reloading:
```bash
npm run dev
```

## Production Deployment Options

### Option 1: PM2 (Recommended for VPS/Server)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "content-dashboard" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Docker (Containerized Deployment)
Use the provided Dockerfile:
```bash
# Build the Docker image
docker build -t content-dashboard .

# Run the container
docker run -p 3000:3000 --env-file .env content-dashboard
```

### Option 3: Static Hosting (Vercel/Netlify)
The application can be deployed to platforms like Vercel or Netlify with minimal configuration changes.

## Troubleshooting

1. **Port Issues**: Change the PORT in .env if 3000 is already in use
2. **API Limits**: NewsAPI has rate limits; consider caching for production
3. **CORS Issues**: The app is configured for same-origin requests
4. **Memory**: Ensure your server has at least 512MB RAM

## Performance Optimizations

1. **Caching**: Implement Redis for API response caching
2. **CDN**: Use a CDN for static assets
3. **Database**: Consider PostgreSQL for production instead of in-memory storage
4. **Load Balancing**: Use nginx for multiple instances

## Security Considerations

1. Keep API keys secure and never commit them to version control
2. Use HTTPS in production
3. Implement rate limiting for API endpoints
4. Add CSRF protection for production use