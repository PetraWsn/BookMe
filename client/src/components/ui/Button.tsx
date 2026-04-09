import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  disabled,
  ...props
}) => {
  const base = `
    rounded-lg
    px-5 py-2
    font-medium
    text-sm
    text-center
    whitespace-nowrap
    transition-transform transition-colors duration-200
    transform
    focus:outline-none
    focus:ring-2 focus:ring-offset-2
    hover:scale-[1.02]
  `;

  const shadows = `
    shadow-[inset_-3px_3px_4px_rgba(255,255,255,0.4),_-1px_2px_4px_rgba(0,0,0,0.25)]
  `;

  const colors =
    variant === "primary"
      ? "bg-primary text-accent border border-transparent hover:border-primary"
      : "bg-[#FFF9F1] text-secondary border border-secondary/20 hover:border-secondary/60";

  return (
    <button
      disabled={disabled}
      className={clsx(base, colors, shadows, className, {
        "opacity-50 cursor-not-allowed": disabled,
      })}
      {...props}
    >
      {children}
    </button>
  );
};
