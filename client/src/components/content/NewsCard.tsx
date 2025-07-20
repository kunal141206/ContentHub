import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, GripVertical, ExternalLink, Eye, Share } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NewsCardProps {
  item: ContentItem;
  index: number;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, item: ContentItem, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  item,
  index,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const dispatch = useDispatch();
  const { items: favorites } = useSelector((state: RootState) => state.favorites);
  const userId = useSelector((state: RootState) => state.preferences.userId);

  const isFavorite = favorites.some(fav => fav.id === item.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite({ userId, contentId: item.id }));
    } else {
      dispatch(addFavorite({ userId, content: item }));
    }
  };

  const handleReadMore = () => {
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      if (hours < 1) return 'Just now';
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getNewsCategory = () => {
    return item.metadata?.category || 'general';
  };

  const getBadgeColor = (category: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      business: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      health: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
      science: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const category = getNewsCategory();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "overflow-hidden group cursor-grab transition-all duration-200",
          "hover:shadow-lg border border-gray-200 dark:border-gray-700",
          isDragging && "opacity-50 cursor-grabbing"
        )}
        draggable
        onDragStart={(e) => onDragStart(e, item, index)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={onDragEnd}
      >
        <div className="relative">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          
          {/* Breaking/Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={cn("text-xs font-semibold", getBadgeColor(category))}>
              {category.toUpperCase()}
            </Badge>
          </div>

          {/* Drag Handle */}
          <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded">
              <GripVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-white dark:hover:bg-gray-800",
              isFavorite && "text-red-500 hover:text-red-600"
            )}
            onClick={handleFavoriteToggle}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </Button>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase">
              {category}
            </span>
            <span>•</span>
            <span>{formatDate(item.publishedAt)}</span>
            {item.metadata?.source && (
              <>
                <span>•</span>
                <span>{item.metadata.source}</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{Math.floor(Math.random() * 5000) + 500}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Share className="w-4 h-4" />
                <span>{Math.floor(Math.random() * 200) + 50}</span>
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReadMore}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Read More →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsCard;
