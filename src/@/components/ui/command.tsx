"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "../../lib/utils";
import { Dialog, DialogContent } from "../../components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "twflex twh-full tww-full twflex-col twoverflow-hidden twrounded-md twbg-popover twtext-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="twoverflow-hidden twp-0 twshadow-lg">
        <Command className="[&_[cmdk-group-heading]]:twpx-2 [&_[cmdk-group-heading]]:twfont-medium [&_[cmdk-group-heading]]:twtext-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:twpt-0 [&_[cmdk-group]]:twpx-2 [&_[cmdk-input-wrapper]_svg]:twh-5 [&_[cmdk-input-wrapper]_svg]:tww-5 [&_[cmdk-input]]:twh-12 [&_[cmdk-item]]:twpx-2 [&_[cmdk-item]]:twpy-3 [&_[cmdk-item]_svg]:twh-5 [&_[cmdk-item]_svg]:tww-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="twflex twitems-center twborder-b twpx-3"
    cmdk-input-wrapper=""
  >
    <Search className="twmr-2 twh-4 tww-4 twshrink-0 twopacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "twflex twh-11 tww-full twrounded-md twbg-transparent twpy-3 twtext-sm twoutline-none placeholder:twtext-muted-foreground disabled:twcursor-not-allowed disabled:twopacity-50",
        className
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "twmax-h-[300px] twoverflow-y-auto twoverflow-x-hidden",
      className
    )}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="twpy-6 twtext-center twtext-sm"
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "twoverflow-hidden twp-1 twtext-foreground [&_[cmdk-group-heading]]:twpx-2 [&_[cmdk-group-heading]]:twpy-1.5 [&_[cmdk-group-heading]]:twtext-xs [&_[cmdk-group-heading]]:twfont-medium [&_[cmdk-group-heading]]:twtext-muted-foreground",
      className
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("tw-mx-1 twh-px twbg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "twrelative twflex twcursor-default twselect-none twitems-center twrounded-sm twpx-2 twpy-1.5 twtext-sm twoutline-none aria-selected:twbg-accent aria-selected:twtext-accent-foreground data-[disabled]:twpointer-events-none data-[disabled]:twopacity-50",
      className
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "twml-auto twtext-xs twtracking-widest twtext-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
