'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step: number;
  initialValue?: [number, number];
  onRangeChange: (range: [number, number]) => void;
}

export function PriceRangeSlider({ 
  min, 
  max, 
  step,
  initialValue,
  onRangeChange 
}: PriceRangeSliderProps) {
  const [range, setRange] = useState<[number, number]>(initialValue || [min, max]);

  // Update range when initialValue changes
  useEffect(() => {
    if (initialValue) {
      setRange(initialValue);
    }
  }, [initialValue]);

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRangeChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setRange(newRange);
    onRangeChange(newRange);
  };

  return (
    <div className="space-y-6">
      <Slider
        defaultValue={range}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        value={range}
        onValueChange={handleRangeChange}
        className="my-4"
      />
      <div className="flex justify-between">
        <div className="px-3 py-1.5 bg-gray-50 border rounded-md text-sm">
          {formatPrice(range[0])}
        </div>
        <div className="px-3 py-1.5 bg-gray-50 border rounded-md text-sm">
          {formatPrice(range[1])}
        </div>
      </div>
    </div>
  );
} 