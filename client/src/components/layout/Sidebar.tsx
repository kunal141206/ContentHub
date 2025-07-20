import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleCategory } from '@/store/slices/preferencesSlice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutGrid, 
  TrendingUp, 
  Heart, 
  Compass, 
  Settings,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: 'feed' | 'trending' | 'favorites' | 'discover';
  onSectionChange: (section: 'feed' | 'trending' | 'favorites' | 'discover') => void;
}

const navigationItems = [
  { id: 'feed', label: 'My Feed', icon: LayoutGrid },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'discover', label: 'Discover', icon: Compass },
];

const contentCategories = [
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.preferences);
  const { items: favorites } = useSelector((state: RootState) => state.favorites);

  const handleCategoryToggle = (categoryId: string) => {
    dispatch(toggleCategory(categoryId));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo & Brand */}
      <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">ContentHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3",
                isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => onSectionChange(item.id as any)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === 'favorites' && favorites.length > 0 && (
                <span className="ml-auto bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {favorites.length}
                </span>
              )}
              {item.id === 'trending' && (
                <Flame className="w-4 h-4 ml-auto text-orange-500" />
              )}
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* Content Categories */}
      <div className="px-4 py-6">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Content Types
        </h3>
        <div className="space-y-3">
          {contentCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={categories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <label
                htmlFor={category.id}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* User Settings */}
      <div className="px-4 py-4">
        <Button variant="ghost" className="w-full justify-start space-x-3">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
