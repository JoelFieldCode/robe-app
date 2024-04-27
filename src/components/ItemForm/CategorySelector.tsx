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
          className="w-[200px] justify-between"
        >
          {value?.name ?? value?.inputValue ?? "Which category?"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search categories"
            className="h-9"
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
                  className="py-3"
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
                      "ml-auto h-4 w-4",
                      value?.id === category.id ? "opacity-100" : "opacity-0"
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
