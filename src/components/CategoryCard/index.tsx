import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "../../gql/graphql";
import { graphql } from "../../gql";
import { client } from "../../services/GraphQLClient";
import { formatItemCount } from "../../utils/formatItemCount";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../@/components/ui/dialog";
import { Link } from "react-router-dom";

const deleteCategoryMutation = graphql(/* GraphQL */ `
  mutation deleteCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId)
  }
`);

const CategoryCard: React.FC<{
  category: Category;
}> = ({ category }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    () =>
      client.request({
        document: deleteCategoryMutation,
        variables: { categoryId: category.id },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Link key={category.id} to={`/categories/${String(category.id)}`}>
      <Card className="cursor-pointer">
        {category.image_url && (
          <img
            className="w-full max-h-96 object-contain"
            src={category.image_url}
          />
        )}
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>
            {formatItemCount(category.itemCount)}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClickOpen();
            }}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={(_open) => setOpen(_open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
            <DialogDescription>
              This will also remove any items attached to the category, are you
              sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async (e) => {
                e.stopPropagation();
                mutate();
              }}
              disabled={isLoading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Link>
  );
};

export default CategoryCard;
