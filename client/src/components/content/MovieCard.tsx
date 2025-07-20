import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, GripVertical, Play, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MovieCardProps {
  item: ContentItem;
  index: number;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, item: ContentItem, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
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

  const handleWatchNow = () => {
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getRating = () => {
    return item.metadata?.rating ? Number(item.metadata.rating).toFixed(1) : null;
  };

  const getYear = () => {
    if (!item.publishedAt) return '';
    try {
      return new Date(item.publishedAt).getFullYear().toString();
    } catch {
      return '';
    }
  };

  const rating = getRating();
  const year = getYear();

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
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* IMDB Rating */}
          {rating && (
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-500 text-black text-xs font-bold">
                  {rating}
                </Badge>
                <span className="text-sm">TMDB Rating</span>
              </div>
            </div>
          )}

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
            <span className="font-semibold text-purple-600 dark:text-purple-400 uppercase">
              RECOMMENDED
            </span>
            {year && (
              <>
                <span>•</span>
                <span>{year}</span>
              </>
            )}
            <span>•</span>
            <span>Action, Sci-Fi</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
                <Clock className="w-4 h-4" />
                <span>2h 18m</span>
              </span>
              {rating && (
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{rating}/10</span>
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleWatchNow}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Watch Now →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
