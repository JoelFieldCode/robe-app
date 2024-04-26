import * as React from "react";
import { CheckIcon, ChevronDown } from "lucide-react";

import { cn } from "../../@/lib/utils";
import { Button } from "../../@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../@/components/ui/popover";
import { CategoryOptionType } from ".";

export const CategorySelector = ({
  categories,
  onChange,
  value,
}: {
  categories: CategoryOptionType[];
  value?: CategoryOptionType | null;
  onChange: (category: CategoryOptionType) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  // possibly need a debounce?
  const [input, setInput] = React.useState("");

  // this doesn't remember previously created categories though.
  const categoriesWithCreated = [
    ...categories,
    ...(value?.inputValue
      ? [
          {
            id: undefined,
            name: value.inputValue,
            inputValue: value.inputValue,
          },
        ]
      : []),
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="tww-[200px] twjustify-between"
        >
          {value?.name ?? value?.inputValue ?? "Which category?"}
          <ChevronDown className="twml-2 twh-4 tww-4 twshrink-0 twopacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput
            placeholder="Search categories"
            className="twh-9"
            onValueChange={(value) => setInput(value)}
          />
          <CommandEmpty>
            <Button
              onClick={() => {
                onChange({
                  id: undefined,
                  inputValue: input,
                  name: input,
                });
                setOpen(false);
              }}
              variant="ghost"
            >
              Create "{input}"?
            </Button>
          </CommandEmpty>

          <CommandList>
            <CommandGroup>
              {categoriesWithCreated.map((category) => (
                <CommandItem
                  key={category.id}
                  className="twpy-3"
                  value={category.id ?? category.inputValue ?? undefined}
                  onSelect={(currentValue) => {
                    const existingCategory = categories.find(
                      (category) => category.id === currentValue
                    );
                    onChange({
                      id: existingCategory?.id,
                      inputValue: !existingCategory ? currentValue : undefined,
                      name: existingCategory?.name ?? currentValue,
                    });
                    setOpen(false);
                  }}
                >
                  {category.name}
                  <CheckIcon
                    className={cn(
                      "twml-auto twh-4 tww-4",
                      value?.id === category.id
                        ? "twopacity-100"
                        : "twopacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
