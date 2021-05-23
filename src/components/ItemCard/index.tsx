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
import { useDispatch } from "react-redux";
import Item from "../../models/Item";
import { deleteItem } from "../../store/slices/items";

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const dispatch = useDispatch();
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
              setDeleting(true);
              setTimeout(() => {
                dispatch(deleteItem(item));
              }, 300);
            }}
            disabled={deleting}
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
