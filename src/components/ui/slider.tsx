'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface SliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    'value' | 'onValueChange' | 'defaultValue'
  > {
  value?: [number, number] | number[];
  defaultValue?: [number, number] | number[];
  onValueChange?: (value: [number, number]) => void;
  onValueCommit?: (value: [number, number]) => void;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onValueCommit,
      min = 0,
      max = 100,
      step = 1,
      ...props
    },
    ref
  ) => {
    const thumbCount = Array.isArray(value)
      ? Math.max(value.length, 1)
      : Array.isArray(defaultValue)
        ? Math.max(defaultValue.length, 1)
        : 2;

    const safeMax = max > min ? max : min + Math.max(Number(step) || 1, 1);

    const emit =
      (handler?: (value: [number, number]) => void) => (next: number[]) => {
        if (!handler) return;
        const low = next[0] ?? min;
        const high = next[1] ?? next[0] ?? safeMax;
        handler([Math.min(low, high), Math.max(low, high)]);
      };

    return (
      <SliderPrimitive.Root
        ref={ref}
        {...props}
        min={min}
        max={safeMax}
        step={step}
        value={value}
        defaultValue={defaultValue}
        onValueChange={emit(onValueChange)}
        onValueCommit={emit(onValueCommit)}
        className={cn(
          'relative flex w-full touch-none select-none items-center px-2.5 py-3',
          className
        )}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow cursor-pointer rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="relative z-10 block h-5 w-5 shrink-0 cursor-grab rounded-full border-2 border-primary bg-background shadow-md ring-offset-background transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
