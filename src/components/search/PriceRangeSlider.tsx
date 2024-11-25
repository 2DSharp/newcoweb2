'use client';

import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  onRangeChange?: (range: [number, number]) => void;
}

export function PriceRangeSlider({ 
  min = 0, 
  max = 10000, 
  step = 100,
  onRangeChange 
}: PriceRangeSliderProps) {
  const [range, setRange] = useState<[number, number]>([min, max]);
  const debouncedRange = useDebounce(range, 500);

  const handleRangeChange = (newRange: number[]) => {
    setRange([newRange[0], newRange[1]]);
  };

  const handleInputChange = (value: string, index: number) => {
    const newValue = parseInt(value) || 0;
    const newRange = [...range] as [number, number];
    newRange[index] = newValue;
    
    // Ensure min <= max
    if (index === 0 && newValue > range[1]) {
      newRange[1] = newValue;
    } else if (index === 1 && newValue < range[0]) {
      newRange[0] = newValue;
    }
    
    setRange(newRange);
  };

  useEffect(() => {
    onRangeChange?.(debouncedRange);
  }, [debouncedRange, onRangeChange]);

  return (
    <div className="space-y-4">
      <div className="pt-4">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[range[0], range[1]]}
          max={max}
          min={min}
          step={step}
          minStepsBetweenThumbs={1}
          onValueChange={handleRangeChange}
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-black rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-4 h-4 bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label="Minimum price"
          />
          <Slider.Thumb
            className="block w-4 h-4 bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label="Maximum price"
          />
        </Slider.Root>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="number"
            value={range[0]}
            onChange={(e) => handleInputChange(e.target.value, 0)}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
        <div className="flex items-center text-gray-500">to</div>
        <div className="flex-1">
          <Input
            type="number"
            value={range[1]}
            onChange={(e) => handleInputChange(e.target.value, 1)}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
} 