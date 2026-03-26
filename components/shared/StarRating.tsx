'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  readonly = true,
  onChange,
  className,
}: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2;
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-6 h-6' };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[...Array(maxStars)].map((_, i) => {
        const value = i + 1;
        const isFilled = value <= roundedRating;
        const isHalf = value - 0.5 === roundedRating;

        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(value)}
            className={cn(
              "focus:outline-none transition-transform",
              !readonly && "hover:scale-110 active:scale-95 cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <div className="relative">
              <Star className={cn(sizes[size], "text-gray-200 fill-gray-200")} />
              {(isFilled || isHalf) && (
                <div
                  className={cn("absolute inset-0 overflow-hidden", isHalf ? "w-[50%]" : "w-full")}
                >
                  <Star className={cn(sizes[size], "text-yellow-400 fill-yellow-400")} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
