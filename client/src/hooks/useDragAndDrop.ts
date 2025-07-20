import { useState } from 'react';

export interface DragItem {
  id: string;
  index: number;
  type: string;
}

export function useDragAndDrop<T extends { id: string }>(
  items: T[],
  onReorder: (from: number, to: number) => void
) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const handleDragStart = (e: React.DragEvent, item: T, index: number) => {
    const dragItem: DragItem = {
      id: item.id,
      index,
      type: 'content-item',
    };
    
    setDraggedItem(dragItem);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/json', JSON.stringify(dragItem));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const dragIndex = draggedItem.index;
    
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
