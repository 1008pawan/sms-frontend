import { Check } from "lucide-react";
import clsx from "clsx";

export default function Stepper({ currentStep }) {
  const steps = [
    { id: 1, label: "Your Details" },
    { id: 2, label: "Review" },
    { id: 3, label: "Confirmation" },
  ];

  return (
    <div className="flex items-center justify-between w-full mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div
            key={step.id}
            className="flex flex-col items-center relative flex-1"
          >
            {/* Line connecting steps */}
            {index !== steps.length - 1 && (
              <div
                className={clsx(
                  "absolute top-4 left-1/2 w-full h-[2px] -z-10",
                  isCompleted ? "bg-blue-600" : "bg-slate-200",
                )}
              />
            )}

            {/* Circle */}
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : isCompleted
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-400 border-slate-200",
              )}
            >
              {isCompleted ? <Check size={14} /> : step.id}
            </div>

            {/* Label */}
            <span
              className={clsx(
                "text-xs font-bold mt-2",
                isActive || isCompleted ? "text-slate-800" : "text-slate-400",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
