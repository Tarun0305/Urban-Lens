import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  initialRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ initialRating = 0, onRate, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating);

  React.useEffect(() => {
    setSelected(initialRating);
  }, [initialRating]);

  const handleClick = (r: number) => {
    if (readonly) return;
    setSelected(r);
    if (onRate) onRate(r);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={readonly ? 18 : 24}
          className={`${
            (hovered || selected) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-slate-600'
          } ${!readonly ? 'cursor-pointer hover:scale-110' : ''} transition-all`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
