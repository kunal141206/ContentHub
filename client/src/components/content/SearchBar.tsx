import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { searchContent, clearSearchResults } from '@/store/slices/contentSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  
  const dispatch = useDispatch();
  const { searchResults, searchLoading } = useSelector((state: RootState) => state.content);

  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      dispatch(searchContent({ query: debouncedQuery }));
      setShowSuggestions(true);
    } else {
      dispatch(clearSearchResults());
      setShowSuggestions(false);
    }
  }, [debouncedQuery, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchContent({ query: query.trim() }));
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    // Optionally navigate to the content item
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {searchLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Search news, movies, posts..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          onBlur={handleBlur}
          className="pl-10 pr-3 w-full"
        />
      </form>

      {/* Search Suggestions */}
      {showSuggestions && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {searchResults.slice(0, 5).map((result) => (
              <Button
                key={result.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start p-3 h-auto text-left",
                  "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                onClick={() => handleSuggestionClick(result)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    in {result.type}
                  </p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
