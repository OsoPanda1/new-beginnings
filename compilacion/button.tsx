import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-border bg-transparent hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        elite: "relative overflow-hidden bg-gradient-to-r from-[hsl(43,38%,47%)] via-[hsl(43,45%,60%)] to-[hsl(43,35%,35%)] text-[hsl(220,30%,8%)] shadow-[0_4px_30px_-5px_hsla(43,38%,47%,0.4)] hover:shadow-[0_8px_40px_-5px_hsla(43,38%,47%,0.6)] hover:-translate-y-0.5",
        gold: "border-2 border-[hsl(43,38%,47%)] bg-transparent text-[hsl(43,38%,47%)] hover:bg-[hsl(43,38%,47%)] hover:text-[hsl(210,20%,95%)]",
        goldOutline: "border-2 border-[hsl(43,38%,47%)] bg-transparent text-[hsl(43,38%,47%)] hover:bg-[hsl(43,38%,47%)]/10",
        teal: "border-2 border-[hsl(185,50%,40%)] bg-transparent text-[hsl(185,50%,40%)] hover:bg-[hsl(185,50%,40%)] hover:text-[hsl(210,20%,95%)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
