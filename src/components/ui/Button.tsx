import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonStyles = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-medium transition-[transform,colors,box-shadow] duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]",
          "hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5",
        ].join(" "),
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:border-primary hover:text-primary",
        ].join(" "),
        ghost: "text-foreground hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonOwnProps = VariantProps<typeof buttonStyles>;
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonOwnProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, ...props },
  ref,
) {
  return (
    <button ref={ref} className={cn(buttonStyles({ variant, size }), className)} {...props} />
  );
});

type LinkBtnProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonOwnProps;
export function LinkButton({ className, variant, size, ...props }: LinkBtnProps) {
  return <a className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export { buttonStyles };
