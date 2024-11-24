import { Button } from "@/components/ui/button"
import { ButtonProps } from "@radix-ui/react-button"
import { cn } from "@/lib/utils"

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function PrimaryButton({ children, className, ...props }: PrimaryButtonProps) {
  return (
    <Button 
      className={cn(
        "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors",
        "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "disabled:bg-indigo-400 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
} 