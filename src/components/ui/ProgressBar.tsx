import { motion } from "framer-motion";
import { REGISTRATION_STEPS } from "../../registration/types";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = ((currentStep - 1) / (REGISTRATION_STEPS.length - 1)) * 100;

  return (
    <div className="mb-8 md:mb-10" aria-label="Registration progress">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gold-600">
          Step {currentStep} of {REGISTRATION_STEPS.length}
        </p>
        <p className="text-sm text-warm-gray hidden sm:block">
          {REGISTRATION_STEPS[currentStep - 1]?.label}
        </p>
      </div>

      <div
        className="h-2 rounded-full bg-gold-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={REGISTRATION_STEPS.length}
        aria-label={`Step ${currentStep} of ${REGISTRATION_STEPS.length}`}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <ol className="mt-4 hidden lg:grid lg:grid-cols-6 gap-2">
        {REGISTRATION_STEPS.map((step) => (
          <li
            key={step.id}
            className={`text-xs text-center leading-tight px-1 ${
              step.id === currentStep
                ? "text-gold-700 font-semibold"
                : step.id < currentStep
                  ? "text-gold-500"
                  : "text-warm-gray/70"
            }`}
            aria-current={step.id === currentStep ? "step" : undefined}
          >
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
