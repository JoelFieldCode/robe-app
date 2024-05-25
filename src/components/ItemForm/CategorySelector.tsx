import React, { useCallback } from "react";
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
import * as Sentry from "@sentry/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../@/components/ui/popover";
import { CategoryOptionType, FormValues } from ".";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../../@/components/ui/sheet";
import { Input } from "../../@/components/ui/input";
import { ErrorMessage } from "@hookform/error-message";
import { useFormContext } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryMutation, CreateCategoryInput } from "../../gql/graphql";
import { client } from "../../services/GraphQLClient";
import { withError } from "../../utils/withError";
import { Alert, AlertTitle } from "../../@/components/ui/alert";
import { graphql } from "../../gql/gql";

const createCategoryMutation = graphql(/* GraphQL */ `
  mutation createCategory($input: CreateCategoryInput) {
    createCategory(input: $input) {
      id
      name
    }
  }
`);

export const CategorySelector = ({
  categories,
  onChange,
  value,
}: {
  categories: CategoryOptionType[];
  value?: CategoryOptionType | null;
  onChange: (category: CategoryOptionType) => void;
}) => {
  const { register, formState, setError, setValue, getValues } =
    useFormContext<FormValues>();
  const [popOverOpen, setPopoverOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const createCategory = useMutation<
    CreateCategoryMutation,
    Error,
    CreateCategoryInput
  >(
    async (createCategoryInput) => {
      try {
        return await client.request({
          document: createCategoryMutation,
          variables: { input: createCategoryInput },
        });
      } catch (err) {
        return withError(err);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );

  const onSubmitCategory = useCallback(async (categoryName?: string | null) => {
    try {
      if (!categoryName?.length) {
        setError("category.name", {
          message: "Please enter a category name",
        });
        return;
      }
      const res = await createCategory.mutateAsync({
        name: categoryName,
      });

      if (res.createCategory) {
        const { id, name } = res.createCategory;
        setValue(
          "category",
          {
            id,
            name,
          },
          { shouldTouch: true, shouldValidate: true, shouldDirty: true }
        );
        setSheetOpen(false);
      } else {
        // TODO handle error
      }
    } catch (err) {
      // TODO show error..
      Sentry.captureException(err, {
        level: "error",
        tags: {
          type: "Create Category",
        },
        extra: { name: categoryName },
      });
    }
  }, []);

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
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search categories" className="h-9" />
              <CommandEmpty>
                <div className="flex flex-col px-2">
                  <SheetTrigger asChild>
                    <Button
                      className="font-bold"
                      onClick={() => {
                        setPopoverOpen(false);
                      }}
                    >
                      Create new category
                    </Button>
                  </SheetTrigger>
                </div>
              </CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <div className="flex flex-col py-2">
                    <SheetTrigger asChild>
                      <Button
                        className="font-bold"
                        onClick={() => {
                          setPopoverOpen(false);
                        }}
                      >
                        Create new category
                      </Button>
                    </SheetTrigger>
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
                          value?.id === category.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle className="mb-3">Create Category</SheetTitle>
            </SheetHeader>
            <SheetFooter>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSubmitCategory(getValues().category?.name);
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <Input
                    {...register("category.name")}
                    type="string"
                    placeholder="Enter a category name"
                  />

                  <ErrorMessage
                    name="category.name"
                    errors={formState.errors}
                    render={({ message }) => (
                      <p className="text-red-500">{message}</p>
                    )}
                  />
                </div>
                <Button
                  variant="default"
                  type="submit"
                  disabled={createCategory.isLoading}
                >
                  Submit
                </Button>
                {createCategory.isError && (
                  <div>
                    <Alert variant="destructive">
                      <AlertTitle>
                        {createCategory.error
                          ? createCategory.error.message
                          : "Error creating category, please try again"}
                      </AlertTitle>
                    </Alert>
                  </div>
                )}
              </form>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Popover>
    </>
  );
};
