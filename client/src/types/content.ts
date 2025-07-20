export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social' | 'sports' | 'music';
  title: string;
  description?: string;
  imageUrl?: string;
  sourceUrl?: string;
  publishedAt?: string;
  metadata?: Record<string, any>;
}

export interface NewsItem extends ContentItem {
  type: 'news';
  metadata: {
    source?: string;
    author?: string;
    category?: string;
  };
}

export interface MovieItem extends ContentItem {
  type: 'movie';
  metadata: {
    rating?: number;
    voteCount?: number;
    genres?: number[];
    adult?: boolean;
  };
}

export interface SocialItem extends ContentItem {
  type: 'social';
  metadata: {
    author?: string;
    handle?: string;
    likes?: number;
    shares?: number;
    replies?: number;
  };
}

export interface SportsItem extends ContentItem {
  type: 'sports';
  metadata: {
    score?: string;
    teams?: string[];
    league?: string;
  };
}

export interface MusicItem extends ContentItem {
  type: 'music';
  metadata: {
    artist?: string;
    album?: string;
    duration?: string;
    genre?: string;
    plays?: number;
  };
}

export type SearchSuggestion = {
  query: string;
  type: string;
  category?: string;
};
