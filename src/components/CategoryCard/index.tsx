import {
  Button,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "../../gql/graphql";
import { graphql } from "../../gql";
import { client } from "../../services/GraphQLClient";
import { formatItemCount } from "../../utils/formatItemCount";
import { Card } from "../../@/components/ui/card";

const deleteCategoryMutation = graphql(/* GraphQL */ `
  mutation deleteCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId)
  }
`);

const CategoryCard: React.FC<{
  category: Category;
  setViewedCategoryId: (categoryId: number) => void;
}> = ({ category, setViewedCategoryId }) => {
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
    <>
      <div
        key={category.id}
        className="twcursor-pointer"
        onClick={() => setViewedCategoryId(category.id)}
      >
        <Card>
          <CardContent style={{ textAlign: "center" }}>
            <Typography align="center">{category.name}</Typography>
            <Typography align="center" variant="caption">
              {formatItemCount(category.itemCount)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleClickOpen();
              }}
            >
              DELETE
            </Button>
          </CardActions>
        </Card>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        disableBackdropClick={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Category?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting a Category will also remove any items attached to it, are
            you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={async (e) => {
              e.stopPropagation();
              mutate();
            }}
            disabled={isLoading}
            color="secondary"
          >
            Delete Category
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryCard;
