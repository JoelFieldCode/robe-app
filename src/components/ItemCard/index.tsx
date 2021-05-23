import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import API from "../../services/Api";
import Item from "../../models/Item";
import { Category } from "../../models/Category";

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    (item: Item) =>
      API.delete(`/api/categories/${item.category_id}/items/${item.id}`).then(
        () => API.get<Category>(`/api/categories/${item.category_id}`)
      ),
    {
      onSuccess: (data) => {
        // Optimistically update to the new value
        queryClient.setQueryData<Category[]>(
          "categories",
          (oldCategories) =>
            oldCategories?.map((category) => {
              if (category.id === data.data.id) {
                return data.data;
              } else {
                return category;
              }
            }) ?? []
        );
        queryClient.invalidateQueries([
          "categories",
          item.category_id,
          "items",
        ]);
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
      <Grid key={item.id} item xs={12} sm={6} md={6}>
        <Card>
          <CardMedia
            component="img"
            image={item.image_url}
            style={{ objectFit: "contain", height: 250 }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs>
                <Typography>
                  <Link underline="none" target="_blank" href={item.url}>
                    {item.name}
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Box fontWeight="fontWeightBold">
                  <Typography>${item.price}</Typography>
                </Box>
              </Grid>
            </Grid>
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
        <DialogTitle id="alert-dialog-title">Delete Item?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            "{item.name}" will be permanently removed, are you sure?
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
              mutate(item);
            }}
            disabled={isLoading}
            color="secondary"
          >
            Delete Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemCard;
