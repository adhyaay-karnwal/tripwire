import { useEffect, useState } from "react";
import { cn } from "@tripwire/ui/utils";

interface PendingChangesToolbarProps {
  summary: string;
  onAccept: () => void;
  onCancel: () => void;
}

export function PendingChangesToolbar({ summary, onAccept, onCancel }: PendingChangesToolbarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 z-20",
        "flex items-center gap-3 px-4 py-2.5 rounded-xl",
        "bg-tw-card/95 border border-tw-border backdrop-blur-sm shadow-lg",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center size-5 rounded-md bg-tw-accent/15">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-tw-accent">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-[13px] text-tw-text-primary font-medium">AI proposed changes</span>
      </div>

      <span className="text-[12px] text-tw-text-muted">{summary}</span>

      <div className="flex items-center gap-1.5 ml-1">
        <button
          type="button"
          onClick={onAccept}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-tw-success/15 text-tw-success text-[12px] font-medium hover:bg-tw-success/25 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Accept
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-tw-hover text-tw-text-muted text-[12px] font-medium hover:text-tw-text-primary hover:bg-[#FFFFFF12] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Revert
        </button>
      </div>
    </div>
  );
}
