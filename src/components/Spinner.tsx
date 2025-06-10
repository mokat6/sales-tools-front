import { Loader2 } from "lucide-react";

type SpinnerProps = {
  size: "sm" | "md" | "lg";
};

const SIZES = {
  sm: "w-5 h-5",
  md: "w-15 h-15",
  lg: "w-30 h-30",
};

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClass = SIZES[size];

  return <Loader2 className={`animate-spin text-muted-foreground ${sizeClass}`} />;
}
