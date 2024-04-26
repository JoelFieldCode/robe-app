"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "twfixed twinset-0 twz-50 twbg-black/80 tw data-[state=open]:twanimate-in data-[state=closed]:twanimate-out data-[state=closed]:twfade-out-0 data-[state=open]:twfade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "twfixed twleft-[50%] twtop-[50%] twz-50 twgrid tww-full twmax-w-lg twtranslate-x-[-50%] twtranslate-y-[-50%] twgap-4 twborder twbg-background twp-6 twshadow-lg twduration-200 data-[state=open]:twanimate-in data-[state=closed]:twanimate-out data-[state=closed]:twfade-out-0 data-[state=open]:twfade-in-0 data-[state=closed]:twzoom-out-95 data-[state=open]:twzoom-in-95 data-[state=closed]:twslide-out-to-left-1/2 data-[state=closed]:twslide-out-to-top-[48%] data-[state=open]:twslide-in-from-left-1/2 data-[state=open]:twslide-in-from-top-[48%] sm:twrounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="twabsolute twright-4 twtop-4 twrounded-sm twopacity-70 twring-offset-background twtransition-opacity hover:twopacity-100 focus:twoutline-none focus:twring-2 focus:twring-ring focus:twring-offset-2 disabled:twpointer-events-none data-[state=open]:twbg-accent data-[state=open]:twtext-muted-foreground">
        <X className="twh-4 tww-4" />
        <span className="twsr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "twflex twflex-col twspace-y-1.5 twtext-center sm:twtext-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "twflex twflex-col-reverse sm:twflex-row sm:twjustify-end sm:twspace-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "twtext-lg twfont-semibold twleading-none twtracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("twtext-sm twtext-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
