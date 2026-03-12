import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";

interface HoverActionButtonProps {
  label?: string;
  className?: string;
  href?: string;
}

export const HoverActionButton = ({
  label = "Button",
  className,
  href = "#",
}: HoverActionButtonProps) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden border border-green-700/50 bg-green-950/30 p-3 text-center font-semibold text-white rounded-xl block",
        className
      )}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {label}
      </span>

      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{label}</span>
        <ArrowRight className="w-4 h-4" />
      </div>

      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] bg-green-700/50 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-amber-500"></div>
    </a>
  );
};
