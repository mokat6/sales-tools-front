import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-padding-button-x py-2 rounded cursor-pointer bg-action-primary text-text-on-primary-action border-5 border-transparent hover:border-[#646cff] transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
