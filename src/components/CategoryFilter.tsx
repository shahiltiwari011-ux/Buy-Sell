import React from 'react';
import type { Category } from '../types';
import { Globe, BookOpen, Laptop, Armchair, Bike, Shirt, MessageSquareMore } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  categoryCounts?: Record<Category, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'All':
        return <Globe className="w-4 h-4" />;
      case 'Books':
        return <BookOpen className="w-4 h-4" />;
      case 'Tech':
        return <Laptop className="w-4 h-4" />;
      case 'Room':
        return <Armchair className="w-4 h-4" />;
      case 'Bikes':
        return <Bike className="w-4 h-4" />;
      case 'Fits':
        return <Shirt className="w-4 h-4" />;
      case 'Other':
        return <MessageSquareMore className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 py-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap border-2 border-black transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#0E6C54] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-slate-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5'
            }`}
          >
            {getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        );
      })}
    </div>
  );
};
