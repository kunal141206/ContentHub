import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  fetchContent, 
  setActiveSection, 
  setSortBy, 
  setViewMode,
  resetContent 
} from '@/store/slices/contentSlice';
import { fetchPreferences } from '@/store/slices/preferencesSlice';
import { fetchFavorites } from '@/store/slices/favoritesSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContentGrid from '@/components/content/ContentGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Grid, List, ArrowDown, Flame, Heart, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    items, 
    loading, 
    error, 
    activeSection, 
    sortBy, 
    viewMode, 
    hasMore, 
    currentPage 
  } = useSelector((state: RootState) => state.content);
  
  const { categories, userId, darkMode } = useSelector((state: RootState) => state.preferences);
  const { items: favorites, loading: favoritesLoading } = useSelector((state: RootState) => state.favorites);

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Initialize user data
    dispatch(fetchPreferences(userId));
    dispatch(fetchFavorites(userId));
    setInitialLoad(false);
  }, [dispatch, userId]);

  useEffect(() => {
    // Fetch content when categories change or on initial load
    if (!initialLoad && categories.length > 0) {
      dispatch(resetContent());
      dispatch(fetchContent({ categories, page: 1, limit: 20 }));
    }
  }, [dispatch, categories, initialLoad]);

  const handleSortChange = (newSort: 'latest' | 'popular' | 'relevant') => {
    dispatch(setSortBy(newSort));
    dispatch(resetContent());
    dispatch(fetchContent({ categories, page: 1, limit: 20 }));
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    dispatch(setViewMode(mode));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchContent({ 
        categories, 
        page: currentPage + 1, 
        limit: 20 
      }));
    }
  };

  const handleClearFavorites = () => {
    // This would need to be implemented in the favorites slice
    // For now, just show that favorites can be cleared
    console.log('Clear favorites functionality would be implemented here');
  };

  const renderFeedSection = () => (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Personalized Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Latest content based on your preferences
          </p>
        </div>
        
        {/* View Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="px-3 py-1"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="px-3 py-1"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">⚠️</div>
              <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                Failed to load content
              </h3>
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                {error}
              </p>
              <Button 
                onClick={() => dispatch(fetchContent({ categories, page: 1, limit: 20 }))}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Grid */}
      <ContentGrid items={items} loading={loading && currentPage === 1} />

      {/* Load More Button */}
      {hasMore && items.length > 0 && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More Content</span>
                <ArrowDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  const renderTrendingSection = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <span>Trending Now</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Most popular content across all categories
          </p>
        </div>
      </div>

      {/* Trending Topics */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              '#AI', '#TechEarnings', '#ElonMusk', '#Lakers', '#NewMusic',
              '#Tesla', '#Netflix', '#Bitcoin', '#Gaming', '#Climate'
            ].map((topic) => (
              <Badge 
                key={topic}
                variant="secondary" 
                className="px-3 py-1 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Content */}
      <ContentGrid items={items.slice(0, 6)} loading={loading && currentPage === 1} />
    </div>
  );

  const renderFavoritesSection = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500" />
            <span>Your Favorites</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Content you've saved for later
          </p>
        </div>
        {favorites.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearFavorites}
            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {favoritesLoading ? (
        <ContentGrid items={[]} loading={true} />
      ) : favorites.length > 0 ? (
        <ContentGrid items={favorites} />
      ) : (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start adding content to your favorites by clicking the heart icon on any card.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDiscoverSection = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Discover New Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore content outside your usual preferences
          </p>
        </div>
      </div>

      {/* Discovery Grid - showing diverse content */}
      <ContentGrid items={items.slice().reverse().slice(0, 9)} loading={loading && currentPage === 1} />
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'trending':
        return renderTrendingSection();
      case 'favorites':
        return renderFavoritesSection();
      case 'discover':
        return renderDiscoverSection();
      default:
        return renderFeedSection();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderActiveSection()}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
