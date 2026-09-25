import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Shared Card — token-driven surface (§5, §6)
 * All portfolio, service, pricing, and feature cards should derive from this.
 * Radius, padding, border, and elevation are tokens — not per-page overrides.
 */

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // base: radius-lg, border subtle, elevation-1, token padding
        "rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-[var(--card-padding)] shadow-[var(--card-shadow)] backdrop-blur-xl transition-[border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:border-[var(--card-border-hover)] hover:shadow-[var(--card-shadow-hover)]",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-[var(--space-2xs)]", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-h3", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-small text-[var(--color-muted-foreground)]", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-[var(--space-sm)]", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center pt-[var(--space-sm)]", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
