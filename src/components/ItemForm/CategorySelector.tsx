import * as React from "react";
import { CheckIcon, ChevronDown } from "lucide-react";

import { cn } from "../../@/lib/utils";
import { Button } from "../../@/components/ui/button";
import {
  Command,
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
  onInitCreateCategory,
}: {
  categories: CategoryOptionType[];
  value?: CategoryOptionType | null;
  onChange: (category: CategoryOptionType) => void;
  onInitCreateCategory: () => void;
}) => {
  const [popOverOpen, setPopoverOpen] = React.useState(false);

  return (
    <>
      <Popover open={popOverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popOverOpen}
            className="w-[200px] justify-between"
          >
            {value?.name ?? "Select a Category"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories" className="h-9" />
            <CommandList>
              <CommandGroup>
                <div className="flex flex-col py-2">
                  <Button
                    className="font-bold"
                    onClick={() => {
                      setPopoverOpen(false);
                      onInitCreateCategory();
                    }}
                  >
                    Create new category
                  </Button>
                </div>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    className="py-3"
                    value={category.name}
                    onSelect={() => {
                      onChange({
                        id: category.id,
                        name: category.name,
                      });
                      setPopoverOpen(false);
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
    </>
  );
};
