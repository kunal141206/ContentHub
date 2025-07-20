import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema, insertFavoriteSchema } from "@shared/schema";

const NewsAPI_KEY = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY ;
const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.TMDB_KEY || "demo_key";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User preferences routes
  app.get("/api/preferences/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await storage.getUserPreferences(userId);
      
      if (!preferences) {
        // Create default preferences
        const defaultPrefs = await storage.createUserPreferences({
          userId,
          categories: ["technology", "business", "sports"],
          darkMode: false,
        });
        return res.json(defaultPrefs);
      }
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to get preferences" });
    }
  });

  app.post("/api/preferences", async (req, res) => {
    try {
      const preferences = insertUserPreferencesSchema.parse(req.body);
      
      const existing = await storage.getUserPreferences(preferences.userId);
      let result;
      
      if (existing) {
        result = await storage.updateUserPreferences(preferences.userId, preferences);
      } else {
        result = await storage.createUserPreferences(preferences);
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid preferences data" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to get favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favorite = insertFavoriteSchema.parse(req.body);
      const result = await storage.addFavorite(favorite);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid favorite data" });
    }
  });

  app.delete("/api/favorites/:userId/:contentId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contentId = req.params.contentId;
      const success = await storage.removeFavorite(userId, contentId);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // News API integration
  app.get("/api/news", async (req, res) => {
    try {
      const { category = "general", country = "us", pageSize = "20", page = "1" } = req.query;
      
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${'bf04cca9fd35402bb07bf1c45ab7d72d'}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "error") {
        throw new Error(data.message || "News API error");
      }
      
      // Transform the data to match our content schema
      const transformedArticles = data.articles?.map((article: any) => ({
        id: article.url,
        type: "news",
        title: article.title,
        description: article.description,
        imageUrl: article.urlToImage,
        sourceUrl: article.url,
        publishedAt: article.publishedAt,
        metadata: {
          source: article.source?.name,
          author: article.author,
          category: category,
        },
      })) || [];
      
      res.json({
        articles: transformedArticles,
        totalResults: data.totalResults || 0,
        status: "success"
      });
    } catch (error) {
      console.error("News API error:", error);
      res.status(500).json({ 
        message: "Failed to fetch news", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // TMDB API integration for movies
  app.get("/api/movies", async (req, res) => {
    try {
      const { category = "popular", page = "1" } = req.query;
      
      const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}&page=${page}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our content schema
      const transformedMovies = data.results?.map((movie: any) => ({
        id: movie.id.toString(),
        type: "movie",
        title: movie.title,
        description: movie.overview,
        imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        sourceUrl: `https://www.themoviedb.org/movie/${movie.id}`,
        publishedAt: movie.release_date,
        metadata: {
          rating: movie.vote_average,
          voteCount: movie.vote_count,
          genres: movie.genre_ids,
          adult: movie.adult,
        },
      })) || [];
      
      res.json({
        movies: transformedMovies,
        totalResults: data.total_results || 0,
        status: "success"
      });
    } catch (error) {
      console.error("TMDB API error:", error);
      res.status(500).json({ 
        message: "Failed to fetch movies", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q: query, type } = req.query;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      
      let results: any[] = [];
      
      // Search news if type is not specified or is "news"
      if (!type || type === "news") {
        try {
          const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=10&apiKey=${'bf04cca9fd35402bb07bf1c45ab7d72d'}`;
          const newsResponse = await fetch(newsUrl);
          
          if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            const newsResults = newsData.articles?.map((article: any) => ({
              id: article.url,
              type: "news",
              title: article.title,
              description: article.description,
              imageUrl: article.urlToImage,
              sourceUrl: article.url,
              publishedAt: article.publishedAt,
              metadata: {
                source: article.source?.name,
                author: article.author,
              },
            })) || [];
            results = [...results, ...newsResults];
          }
        } catch (error) {
          console.error("News search error:", error);
        }
      }
      
      // Search movies if type is not specified or is "movie"
      if (!type || type === "movie") {
        try {
          const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
          const movieResponse = await fetch(movieUrl);
          
          if (movieResponse.ok) {
            const movieData = await movieResponse.json();
            const movieResults = movieData.results?.slice(0, 10).map((movie: any) => ({
              id: movie.id.toString(),
              type: "movie",
              title: movie.title,
              description: movie.overview,
              imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              sourceUrl: `https://www.themoviedb.org/movie/${movie.id}`,
              publishedAt: movie.release_date,
              metadata: {
                rating: movie.vote_average,
                voteCount: movie.vote_count,
              },
            })) || [];
            results = [...results, ...movieResults];
          }
        } catch (error) {
          console.error("Movie search error:", error);
        }
      }
      
      res.json({
        results,
        query,
        status: "success"
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ 
        message: "Search failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Content aggregation endpoint
  app.get("/api/content", async (req, res) => {
    try {
      const { categories, limit = "20", page = "1" } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      let allContent: any[] = [];
      
      // Get news from multiple categories
      if (!categories || (categories as string).includes("technology") || (categories as string).includes("business") || (categories as string).includes("sports")) {
        const newsCategories = categories ? 
          (categories as string).split(",").filter(cat => ["technology", "business", "sports", "entertainment", "health", "science"].includes(cat)) :
          ["technology", "business"];
        
        for (const category of newsCategories) {
          try {
            const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=5&apiKey=${'bf04cca9fd35402bb07bf1c45ab7d72d'}`;
            const newsResponse = await fetch(newsUrl);
            
            if (newsResponse.ok) {
              const newsData = await newsResponse.json();
              const newsItems = newsData.articles?.map((article: any) => ({
                id: `news-${article.url}`,
                type: "news",
                title: article.title,
                description: article.description,
                imageUrl: article.urlToImage,
                sourceUrl: article.url,
                publishedAt: article.publishedAt,
                metadata: {
                  source: article.source?.name,
                  author: article.author,
                  category: category,
                },
              })) || [];
              
              allContent = [...allContent, ...newsItems];
            }
          } catch (error) {
            console.error(`Error fetching ${category} news:`, error);
          }
        }
      }
      
      // Get movies
      try {
        const movieUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=1`;
        const movieResponse = await fetch(movieUrl);
        
        if (movieResponse.ok) {
          const movieData = await movieResponse.json();
          const movieItems = movieData.results?.slice(0, 8).map((movie: any) => ({
            id: `movie-${movie.id}`,
            type: "movie",
            title: movie.title,
            description: movie.overview,
            imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            sourceUrl: `https://www.themoviedb.org/movie/${movie.id}`,
            publishedAt: movie.release_date,
            metadata: {
              rating: movie.vote_average,
              voteCount: movie.vote_count,
              genres: movie.genre_ids,
            },
          })) || [];
          
          allContent = [...allContent, ...movieItems];
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      
      // Shuffle and paginate content
      const shuffled = allContent.sort(() => Math.random() - 0.5);
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedContent = shuffled.slice(startIndex, startIndex + limitNum);
      
      res.json({
        content: paginatedContent,
        totalResults: shuffled.length,
        page: pageNum,
        hasMore: startIndex + limitNum < shuffled.length,
        status: "success"
      });
    } catch (error) {
      console.error("Content aggregation error:", error);
      res.status(500).json({ 
        message: "Failed to fetch content", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
