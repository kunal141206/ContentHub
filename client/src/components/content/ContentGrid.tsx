import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { reorderContent } from '@/store/slices/contentSlice';
import { ContentItem } from '@/types/content';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import ContentCard from './ContentCard';
import NewsCard from './NewsCard';
import MovieCard from './MovieCard';
import SocialCard from './SocialCard';
import SportsCard from './SportsCard';
import MusicCard from './MusicCard';
import { cn } from '@/lib/utils';

interface ContentGridProps {
  items: ContentItem[];
  loading?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({ items, loading }) => {
  const dispatch = useDispatch();
  const { viewMode } = useSelector((state: RootState) => state.content);

  const handleReorder = (from: number, to: number) => {
    dispatch(reorderContent({ from, to }));
  };

  const { draggedItem, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = 
    useDragAndDrop(items, handleReorder);

  const renderContentCard = (item: ContentItem, index: number) => {
    const commonProps = {
      key: item.id,
      item,
      index,
      isDragging: draggedItem?.id === item.id,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onDragEnd: handleDragEnd,
    };

    switch (item.type) {
      case 'news':
        return <NewsCard {...commonProps} />;
      case 'movie':
        return <MovieCard {...commonProps} />;
      case 'social':
        return <SocialCard {...commonProps} />;
      case 'sports':
        return <SportsCard {...commonProps} />;
      case 'music':
        return <MusicCard {...commonProps} />;
      default:
        return <ContentCard {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl text-gray-300 dark:text-gray-600 mb-4">📱</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No content available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your preferences or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      viewMode === 'grid' 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1"
    )}>
      {items.map((item, index) => renderContentCard(item, index))}
    </div>
  );
};

export default ContentGrid;
