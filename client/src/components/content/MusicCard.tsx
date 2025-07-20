import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, GripVertical, Play, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MusicCardProps {
  item: ContentItem;
  index: number;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, item: ContentItem, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
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

  const handlePlay = () => {
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getArtist = () => {
    return item.metadata?.artist || 'Unknown Artist';
  };

  const getDuration = () => {
    return item.metadata?.duration || `${Math.floor(Math.random() * 3) + 3}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}`;
  };

  const getPlays = () => {
    return item.metadata?.plays || Math.floor(Math.random() * 2000000) + 100000;
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  const getGenre = () => {
    return item.metadata?.genre || 'Electronic';
  };

  const getYear = () => {
    if (!item.publishedAt) return new Date().getFullYear().toString();
    try {
      return new Date(item.publishedAt).getFullYear().toString();
    } catch {
      return new Date().getFullYear().toString();
    }
  };

  const artist = getArtist();
  const duration = getDuration();
  const plays = getPlays();
  const genre = getGenre();
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
          
          {/* New Release Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold">
              NEW RELEASE
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

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              onClick={handlePlay}
              className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg"
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-pink-600 dark:text-pink-400 uppercase">
              MUSIC
            </span>
            <span>•</span>
            <span>{genre}</span>
            <span>•</span>
            <span>{year}</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {item.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            by {artist}
          </p>

          {item.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>{formatPlays(plays)}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-primary"
              >
                <Plus className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                onClick={handlePlay}
                className="bg-primary hover:bg-primary/90"
              >
                Play
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MusicCard;
