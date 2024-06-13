import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { Input } from "../../@/components/ui/input";
import { FieldContainer } from "../FieldContainer";
import { Label } from "../../@/components/ui/label";
import { Button } from "../../@/components/ui/button";

export const categorySchema = Yup.object({
  name: Yup.string().required("Please enter a name"),
});

export type FormValues = Yup.InferType<typeof categorySchema>;

export type CategoryFormProps = {
  name?: string | null;
  onSubmit: (formValues: FormValues) => Promise<any>;
  submitText: string;
};

export const CategoryForm: FC<CategoryFormProps> = ({
  name,
  onSubmit,
  submitText,
}) => {
  const form = useForm<FormValues>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: name ?? "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FieldContainer>
            <Label htmlFor="name">Name</Label>
            <Input type="text" {...register("name")} />
            <ErrorMessage
              name="name"
              errors={errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </FieldContainer>

          <div className="flex flex-col">
            <Button disabled={isSubmitting} variant="default" type="submit">
              {submitText}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
