import React from "react";

interface StepCardProps {
  num: string;
  title: string;
  borderColor?: string;
  children: React.ReactNode;
}

export default function StepCard({
  num,
  title,
  borderColor = "border-[var(--gold-500)]/40",
  children,
}: StepCardProps) {
  return (
    <div className={`border-l-2 ${borderColor} pl-5`}>
      <div className="step-num text-[36px] font-display text-[var(--gold-500)]">
        {num}
      </div>
      <div className="font-display text-[18px] mt-2 mb-2 text-[var(--forest-800)]">
        {title}
      </div>
      <div className="text-[13px] leading-[1.6] text-[var(--ink-muted)]">
        {children}
      </div>
    </div>
  );
}
