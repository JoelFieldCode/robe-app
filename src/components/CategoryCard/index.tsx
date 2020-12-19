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
import { useDispatch } from "react-redux";
import { Category } from "../../models/Category";
import { AppDispatch } from "../../store";
import { deleteCategory } from "../../store/slices/categories";

const CategoryCard: React.FC<{
  category: Category;
  setViewedCategoryId: (categoryId: number) => void;
}> = ({ category, setViewedCategoryId }) => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [deleting, setDeleting] = useState(false);
  return (
    <>
      <Grid
        key={category.id}
        style={{ cursor: "pointer" }}
        onClick={() => setViewedCategoryId(category.id)}
        item
        xs={6}
        sm={4}
      >
        <Card>
          <CardContent style={{ textAlign: "center" }}>
            <Typography align="center">{category.name}</Typography>
            <Typography align="center" variant="caption">
              {category.item_count} item{category.item_count === 1 ? "" : "s"}{" "}
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
              setDeleting(true);
              setTimeout(() => {
                dispatch(deleteCategory(category.id));
              }, 300);
            }}
            disabled={deleting}
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
