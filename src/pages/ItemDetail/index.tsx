import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../@/components/ui/button";
import { FullScreenLoader } from "../../components/FullScreenLoader/FullScreenLoader";
import { getItemDocument } from "../../queries/getItem";
import { client } from "../../services/GraphQLClient";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../@/components/ui/dropdown-menu";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../@/components/ui/dialog";
import { Item } from "../../gql/graphql";
import { deleteItemMutation } from "../../queries/deleteItemMutation";
import { Container } from "../../components/Container";

export const ItemDetail = () => {
  const { itemId } = useParams();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const { mutate, isLoading: isMutating } = useMutation(
    (item: Item) =>
      client.request({
        document: deleteItemMutation,
        variables: { itemId: item.id },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        if (item) {
          navigate(`/categories/${item.categoryId}`, { replace: true });
        } else {
          navigate(`/`, { replace: true });
        }
      },
    }
  );

  const { isLoading, isFetching, isError, data } = useQuery(
    ["items", itemId],
    async () =>
      client.request({
        document: getItemDocument,
        variables: { itemId: itemId ? Number(itemId) : 0 },
      }),
    { enabled: !!itemId, retry: false }
  );

  if (isLoading || isFetching) {
    return <FullScreenLoader />;
  }

  if (isError) {
    return <>Item not found</>;
  }

  const item = data?.getItem;

  if (!item) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col">
        {item.image_url && (
          <img
            className="w-full max-h-[500px] object-contain"
            src={item.image_url}
          />
        )}
        <Container>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-bold mb-1">{item.name}</p>
              <p className="text-sm">${item.price}</p>
            </div>

            <div className="flex flex-row justify-between gap-4">
              <Button variant="outline" asChild>
                <a href={item.url} target="_blank">
                  Visit Item
                </a>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" className="rounded-3xl" size="icon">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom">
                  <DropdownMenuItem>
                    <Button variant="ghost" onClick={handleClickOpen}>
                      Delete Item
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button asChild variant="ghost">
                      <Link to={`/items/${item.id}/edit`}>Edit Item</Link>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Container>
      </div>
      <Dialog open={open} onOpenChange={(_open) => setOpen(_open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item?</DialogTitle>
            <DialogDescription>
              "{item.name}" will be permanently removed, are you sure?
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
                mutate(item);
              }}
              disabled={isMutating}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
