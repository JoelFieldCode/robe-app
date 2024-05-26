import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ItemCard from "../ItemCard";
import { client } from "../../services/GraphQLClient";
import { graphql } from "../../gql/gql";
import { formatItemCount } from "../../utils/formatItemCount";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../@/components/ui/dropdown-menu";
import { Button } from "../../@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../@/components/ui/dialog";

const getCategoryDocument = graphql(/* GraphQL */ `
  query getCategory($categoryId: Int!) {
    getCategory(categoryId: $categoryId) {
      id
      name
      image_url
      itemCount
      items {
        id
        name
        image_url
        price
        url
        categoryId
      }
    }
  }
`);

const deleteCategoryMutation = graphql(/* GraphQL */ `
  mutation deleteCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId)
  }
`);

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const { isLoading, isFetching, isError, data } = useQuery(
    ["categories", categoryId],
    async () =>
      client.request({
        document: getCategoryDocument,
        variables: { categoryId: categoryId ? Number(categoryId) : 0 },
      }),
    { enabled: !!categoryId, retry: false }
  );

  const queryClient = useQueryClient();
  const { mutate, isLoading: isDeleting } = useMutation(
    () =>
      client.request({
        document: deleteCategoryMutation,
        variables: { categoryId: Number(categoryId) },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        navigate(`/`, { replace: true });
      },
    }
  );

  if (isLoading || isFetching) {
    <FullScreenLoader />;
  }

  if (isError) {
    return <>Category not found</>;
  }

  const category = data?.getCategory;

  return category ? (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <h3 className="text-lg font-bold">
            {category.name} ({formatItemCount(category.itemCount)})
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger>Action</DropdownMenuTrigger>
            <DropdownMenuContent side="bottom">
              <Button variant="ghost" onClick={handleClickOpen}>
                <DropdownMenuItem>Delete Category</DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          {!category.items?.length ? (
            <p>You haven't added any items to this category yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {category.items?.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
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
              disabled={isDeleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
};

export default CategoryDetail;
