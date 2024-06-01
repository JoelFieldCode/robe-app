import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { FC, useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { Input } from "../../@/components/ui/input";
import { FieldContainer } from "../FieldContainer";
import { Label } from "../../@/components/ui/label";
import { Button } from "../../@/components/ui/button";
import { CreateCategoryMutation, CreateCategoryInput } from "../../gql/graphql";
import { createCategoryMutation } from "../../queries/createCategory";
import { client } from "../../services/GraphQLClient";
import { withError } from "../../utils/withError";

const categorySchema = Yup.object({
  name: Yup.string().required("Please enter a name"),
});

export type FormValues = Yup.InferType<typeof categorySchema>;

export type CategoryFormProps = {
  name: string | null;
};

export const CategoryForm: FC<CategoryFormProps> = ({ name }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const onSubmit = useCallback<SubmitHandler<FormValues>>(async ({ name }) => {
    const res = await createCategory.mutateAsync({
      name,
    });

    if (res.createCategory?.id) {
      navigate(`/categories/${res.createCategory.id}`);
    }
  }, []);

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
              Create Category
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
