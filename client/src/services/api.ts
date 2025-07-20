import { ContentItem } from '@/types/content';

const API_BASE = '';

export const apiRequest = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response;
};

export const contentApi = {
  getContent: async (params: { categories?: string[]; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.categories?.length) {
      searchParams.append('categories', params.categories.join(','));
    }
    if (params.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const response = await apiRequest(`/api/content?${searchParams}`);
    return response.json();
  },

  searchContent: async (query: string, type?: string) => {
    const searchParams = new URLSearchParams({ q: query });
    if (type) {
      searchParams.append('type', type);
    }

    const response = await apiRequest(`/api/search?${searchParams}`);
    return response.json();
  },

  getNews: async (category = 'general', page = 1) => {
    const response = await apiRequest(`/api/news?category=${category}&page=${page}`);
    return response.json();
  },

  getMovies: async (category = 'popular', page = 1) => {
    const response = await apiRequest(`/api/movies?category=${category}&page=${page}`);
    return response.json();
  },
};

export const preferencesApi = {
  getPreferences: async (userId: number) => {
    const response = await apiRequest(`/api/preferences/${userId}`);
    return response.json();
  },

  updatePreferences: async (preferences: {
    userId: number;
    categories: string[];
    darkMode: boolean;
  }) => {
    const response = await apiRequest('/api/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
    return response.json();
  },
};

export const favoritesApi = {
  getFavorites: async (userId: number) => {
    const response = await apiRequest(`/api/favorites/${userId}`);
    return response.json();
  },

  addFavorite: async (params: {
    userId: number;
    contentId: string;
    contentType: string;
    contentData: ContentItem;
  }) => {
    const response = await apiRequest('/api/favorites', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response.json();
  },

  removeFavorite: async (userId: number, contentId: string) => {
    const response = await apiRequest(`/api/favorites/${userId}/${contentId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
