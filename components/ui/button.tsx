import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-logo-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-logo-gold to-logo-darkGold text-white hover:from-logo-darkGold hover:to-logo-bronze shadow-md hover:shadow-lg hover:scale-[1.02]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border-2 border-logo-gold bg-white hover:bg-logo-lightGold/20 text-logo-darkGold hover:border-logo-darkGold",
        secondary:
          "bg-[#1E6F5C] text-white hover:bg-[#175A4A] shadow-sm hover:shadow-md",
        success:
          "bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md hover:scale-[1.02]",
        ghost: "hover:bg-logo-lightGold/20 hover:text-logo-darkGold",
        link: "text-logo-darkGold underline-offset-4 hover:underline hover:text-logo-bronze",
        gold: "bg-gradient-to-r from-logo-gold to-logo-darkGold text-white hover:from-logo-darkGold hover:to-logo-bronze shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
