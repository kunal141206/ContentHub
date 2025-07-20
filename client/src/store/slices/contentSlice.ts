import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types/content';

interface ContentState {
  items: ContentItem[];
  searchResults: ContentItem[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  searchError: string | null;
  currentPage: number;
  hasMore: boolean;
  activeSection: 'feed' | 'trending' | 'favorites' | 'discover';
  sortBy: 'latest' | 'popular' | 'relevant';
  viewMode: 'grid' | 'list';
}

const initialState: ContentState = {
  items: [],
  searchResults: [],
  loading: false,
  searchLoading: false,
  error: null,
  searchError: null,
  currentPage: 1,
  hasMore: true,
  activeSection: 'feed',
  sortBy: 'latest',
  viewMode: 'grid',
};

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async ({ categories, page = 1, limit = 20 }: { categories?: string[]; page?: number; limit?: number }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (categories && categories.length > 0) {
      params.append('categories', categories.join(','));
    }
    
    const response = await fetch(`/api/content?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }
    
    return response.json();
  }
);

export const searchContent = createAsyncThunk(
  'content/searchContent',
  async ({ query, type }: { query: string; type?: string }) => {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    
    const response = await fetch(`/api/search?${params}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    return response.json();
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<ContentState['activeSection']>) => {
      state.activeSection = action.payload;
    },
    setSortBy: (state, action: PayloadAction<ContentState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ContentState['viewMode']>) => {
      state.viewMode = action.payload;
    },
    reorderContent: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      const [removed] = state.items.splice(from, 1);
      state.items.splice(to, 0, removed);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    resetContent: (state) => {
      state.items = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.items = action.payload.content;
        } else {
          state.items.push(...action.payload.content);
        }
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      })
      .addCase(searchContent.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.results;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || 'Search failed';
      });
  },
});

export const {
  setActiveSection,
  setSortBy,
  setViewMode,
  reorderContent,
  clearSearchResults,
  resetContent,
} = contentSlice.actions;

export default contentSlice.reducer;
