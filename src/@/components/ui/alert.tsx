import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const alertVariants = cva(
  "twrelative tww-full twrounded-lg twborder twp-4 [&>svg~*]:twpl-7 [&>svg+div]:twtranslate-y-[-3px] [&>svg]:twabsolute [&>svg]:twleft-4 [&>svg]:twtop-4 [&>svg]:twtext-foreground",
  {
    variants: {
      variant: {
        default: "twbg-background twtext-foreground",
        destructive:
          "twborder-destructive/50 twtext-destructive dark:twborder-destructive [&>svg]:twtext-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "twmb-1 twfont-medium twleading-none twtracking-tight",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("twtext-sm [&_p]:twleading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
