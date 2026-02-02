"use client";

interface StepIndicatorProps {
  step: 1 | 2 | 3 | 4;
}

export function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <p className="text-xs text-stone-500 dark:text-stone-500" aria-hidden>
      Step {step} of 4
    </p>
  );
}
