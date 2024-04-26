import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Item } from "../../gql/graphql";
import { graphql } from "../../gql/gql";
import { client } from "../../services/GraphQLClient";
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
} from "../ui/dialog";

const deleteItemMutation = graphql(/* GraphQL */ `
  mutation deleteItem($itemId: Int!) {
    deleteItem(itemId: $itemId)
  }
`);

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (item: Item) =>
      client.request({
        document: deleteItemMutation,
        variables: { itemId: item.id },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Card>
        <CardHeader>
          {item.image_url && (
            <img
              className="twmax-h-60 twh-60 twobject-contain"
              src={item.image_url}
            />
          )}
          <CardTitle className="twtext-base">{item.name}</CardTitle>
          <CardDescription>${item.price}</CardDescription>
        </CardHeader>
        <CardFooter className="twflex twjustify-between">
          <Button variant="outline" asChild>
            <a href={item.url} target="_blank">
              Go to item
            </a>
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => {
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
            <DialogTitle>Delete Item?</DialogTitle>
            <DialogDescription>
              "{item.name}" will be permanently removed, are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="twgap-3">
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
                mutate(item);
              }}
              disabled={isLoading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemCard;
