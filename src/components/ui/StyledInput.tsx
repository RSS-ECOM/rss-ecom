import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(({ className, ...props }, ref) => {
  return (
    <Input
      className={cn(
        'bg-card/50 border-2 border-input/90 hover:border-muted-foreground/70 focus:border-primary',
        'shadow-inner shadow-black/15 focus:shadow-primary/10',
        'focus:ring-2 focus:ring-primary/20 text-foreground transition-all duration-200',
        'dark:bg-background/40 dark:border-muted dark:text-foreground dark:placeholder:text-muted-foreground/70',
        'placeholder:text-muted-foreground/80 font-lato',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
StyledInput.displayName = 'StyledInput';

export { StyledInput };
