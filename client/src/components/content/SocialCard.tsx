import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, GripVertical, MessageCircle, Repeat2, ExternalLink, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SocialCardProps {
  item: ContentItem;
  index: number;
  isDragging?: boolean;
  onDragStart: (e: React.DragEvent, item: ContentItem, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

const SocialCard: React.FC<SocialCardProps> = ({
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

  const handleViewPost = () => {
    if (item.sourceUrl) {
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      if (hours < 1) return 'now';
      if (hours < 24) return `${hours}h`;
      return `${Math.floor(hours / 24)}d`;
    } catch {
      return '';
    }
  };

  const getAuthorInitials = () => {
    const author = item.metadata?.author || 'User';
    return author.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase();
  };

  const likes = item.metadata?.likes || Math.floor(Math.random() * 10000) + 100;
  const shares = item.metadata?.shares || Math.floor(Math.random() * 1000) + 50;
  const replies = item.metadata?.replies || Math.floor(Math.random() * 500) + 20;

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
        {/* Drag Handle */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded">
            <GripVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                {getAuthorInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.metadata?.author || 'Social User'}
                </span>
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.metadata?.handle || '@user'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-semibold">
                  TRENDING
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(item.publishedAt)}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex-shrink-0",
                isFavorite && "text-red-500 hover:text-red-600"
              )}
              onClick={handleFavoriteToggle}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>
          </div>

          <div className="text-gray-900 dark:text-white mb-4">
            <p>{item.description || item.title}</p>
          </div>

          {item.imageUrl && (
            <div className="relative mb-4">
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
                <span>{likes.toLocaleString()}</span>
              </button>
              
              <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                <Repeat2 className="w-4 h-4" />
                <span>{shares.toLocaleString()}</span>
              </button>
              
              <button className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{replies}</span>
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewPost}
              className="text-primary hover:text-primary/80 font-medium"
            >
              View Post →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SocialCard;
