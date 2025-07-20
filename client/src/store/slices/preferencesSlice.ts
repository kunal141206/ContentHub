import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  userId: number;
  categories: string[];
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PreferencesState = {
  userId: 1, // Mock user ID
  categories: ['technology', 'business', 'sports'],
  darkMode: false,
  loading: false,
  error: null,
};

export const fetchPreferences = createAsyncThunk(
  'preferences/fetchPreferences',
  async (userId: number) => {
    const response = await fetch(`/api/preferences/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch preferences');
    }
    return response.json();
  }
);

export const updatePreferences = createAsyncThunk(
  'preferences/updatePreferences',
  async (preferences: { userId: number; categories: string[]; darkMode: boolean }) => {
    const response = await fetch('/api/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }
    
    return response.json();
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        state.categories = state.categories.filter(c => c !== category);
      } else {
        state.categories.push(category);
      }
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories || state.categories;
        state.darkMode = action.payload.darkMode || false;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch preferences';
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.darkMode = action.payload.darkMode;
      });
  },
});

export const {
  toggleCategory,
  toggleDarkMode,
  setCategories,
  setDarkMode,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
