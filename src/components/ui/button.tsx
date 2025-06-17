
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-bright-green to-green-600 text-white hover:from-green-600 hover:to-green-700",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700",
        outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-text-gray",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-text-gray hover:from-gray-200 hover:to-gray-300",
        ghost: "hover:bg-gray-100 hover:text-text-gray text-gray-600",
        link: "text-bright-green underline-offset-4 hover:underline font-medium",
        accent: "bg-gradient-to-r from-bright-amber to-orange-500 text-white hover:from-orange-500 hover:to-orange-600",
        blue: "bg-gradient-to-r from-bright-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
      },
      size: {
        default: "h-12 px-6 py-3 min-w-[48px]",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
        touch: "h-16 px-8 py-4 text-lg min-w-[64px]",
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
