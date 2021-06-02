import {
  Button,
  Card,
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
import { useMutation, useQueryClient } from "react-query";
import { Category } from "../../models/Category";
import API from "../../services/Api";

const CategoryCard: React.FC<{
  category: Category;
  setViewedCategoryId: (categoryId: number) => void;
}> = ({ category, setViewedCategoryId }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (categoryId: number) => API.delete(`/api/categories/${categoryId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
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
      <Grid
        key={category.id}
        style={{ cursor: "pointer" }}
        onClick={() => setViewedCategoryId(category.id)}
        item
        xs={6}
        sm={6}
      >
        <Card>
          <CardContent style={{ textAlign: "center" }}>
            <Typography align="center">{category.name}</Typography>
            <Typography align="center" variant="caption">
              {category.items_count} item{category.items_count === 1 ? "" : "s"}{" "}
              added
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
      </Grid>
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
              mutate(category.id);
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
