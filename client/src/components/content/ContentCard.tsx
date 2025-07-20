import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, GripVertical, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ContentCardProps {
  item: ContentItem;
  index: number;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, item: ContentItem, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
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

  const handleExternalLink = () => {
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '';
    }
  };

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
          
          {/* Drag Handle */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded">
              <GripVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-white dark:hover:bg-gray-800",
              isFavorite && "text-red-500 hover:text-red-600"
            )}
            onClick={handleFavoriteToggle}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </Button>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="text-xs font-semibold capitalize">
              {item.type}
            </Badge>
            {item.publishedAt && (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(item.publishedAt)}
                </span>
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
              {item.metadata?.source && (
                <span>{item.metadata.source}</span>
              )}
              {item.metadata?.rating && (
                <span className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{item.metadata.rating}</span>
                </span>
              )}
            </div>

            {item.sourceUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExternalLink}
                className="text-primary hover:text-primary/80"
              >
                View
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentCard;
