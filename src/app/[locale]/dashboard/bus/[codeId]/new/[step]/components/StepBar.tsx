"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export interface StepBarProps {
  currentStep: number; // The step from URL (1, 2, 3, 4)
  completedSteps: number; // The step from DB (1, 2, 3)
  totalSteps?: number;
  stepLabels?: string[]; // Optional custom labels, will use translations if not provided
  className?: string;
  businessCodeId?: string; // For navigation
  eventSlug?: string; // For navigation
  allowNavigation?: boolean; // Whether to allow clicking on steps
}

export function StepBar({
  currentStep,
  completedSteps,
  totalSteps = 3,
  stepLabels,
  className,
  businessCodeId,
  eventSlug,
  allowNavigation = false,
}: StepBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("StepBar");
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  // Use provided labels or fall back to translations
  const labels = stepLabels || [t("basicInfo"), t("uploadImages"), t("publishEvent")];

  const handleStepClick = (step: number) => {
    if (!allowNavigation || !businessCodeId) return;

    // Convert step bar number to URL format:
    // Step bar 1 -> URL step 1 (Edit Basic Info)
    // Step bar 2 -> URL step 2 (Upload Images)
    // Step bar 3 -> URL step 3 (Publish Event)
    let urlStep;
    if (step === 1) {
      urlStep = 1; // Edit Basic Info
    } else if (step === 2) {
      urlStep = 2; // Upload Images
    } else if (step === 3) {
      urlStep = 3; // Publish Event
    } else {
      return; // Invalid step
    }

    // Don't allow navigation to step 3 (publish) unless event is published
    if (urlStep === 3 && completedSteps < 3) return;

    // Build the URL with current search params
    const params = new URLSearchParams(searchParams.toString());
    if (eventSlug) {
      params.set("slug", eventSlug);
    }

    const url = `/dashboard/bus/${businessCodeId}/new/${urlStep}?${params.toString()}`;
    router.push(url);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step <= completedSteps;
          const isCurrent = step === currentStep;

          // Define clickable logic:
          // - Step 1: Clickable if we have event data (editing existing event)
          // - Step 2: Clickable if step 1 is completed (basic info done)
          // - Step 3: Clickable if step 2 is completed (images uploaded)
          const isClickable =
            allowNavigation &&
            ((step === 1 && eventSlug) || // Step 1: only if editing existing event
              (step === 2 && completedSteps >= 1) || // Step 2: if step 1 is completed
              (step === 3 && completedSteps >= 2)); // Step 3: if step 2 is completed

          return (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleStepClick(step)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 relative",
                    {
                      // Completed steps
                      "bg-primary text-primary-foreground shadow-md": isCompleted,

                      // Current step - highlighted with glow effect and subtle animation
                      "bg-primary text-primary-foreground border-4 border-primary/30 shadow-lg shadow-primary/25":
                        isCurrent && isCompleted,
                      "bg-primary/20 text-primary border-4 border-primary/50 shadow-lg shadow-primary/25":
                        isCurrent && !isCompleted,

                      // Pending steps
                      "bg-muted": !isCurrent && !isCompleted,

                      // Hover effects for clickable steps
                      "cursor-pointer hover:bg-primary/30 hover:scale-105": isClickable && !isCompleted && !isCurrent,
                      "cursor-pointer hover:bg-primary/90 hover:scale-105": isClickable && isCompleted && !isCurrent,
                      "cursor-default": !isClickable, // Default cursor when not clickable
                    }
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span>{step}</span>}
                </div>

                {/* Step Label */}
                <span
                  className={cn("mt-2 text-xs text-center max-w-20 transition-all duration-200", {
                    "text-primary": isCurrent, // Current step: larger and bolder
                    "text-muted-foreground": !isCurrent && !isCompleted, // Pending steps
                  })}
                >
                  {labels[index]}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn("flex-1 h-0.5 mx-4 transition-colors", {
                    "bg-primary": step < completedSteps,
                    "bg-muted": step >= completedSteps,
                  })}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
