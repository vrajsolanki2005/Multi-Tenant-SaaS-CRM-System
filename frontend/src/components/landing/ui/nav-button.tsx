import React from "react";
import { cn } from "../../../lib/utils";

interface NavButtonProps {
  label?: string;
  className?: string;
  href?: string;
}

export const NavButton = ({
  label = "Button",
  className,
  href = "#",
}: NavButtonProps) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white overflow-hidden rounded-lg transition-all duration-300",
        "bg-gradient-to-r from-green-600 to-amber-500",
        "hover:shadow-lg hover:shadow-green-500/50 hover:scale-105",
        className
      )}
    >
      <span className="relative z-10 transition-all duration-300 group-hover:scale-110">
        {label}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-white/20"></div>
      </div>
    </a>
  );
};
