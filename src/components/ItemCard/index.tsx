import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import Item from "../../models/Item";
import { deleteItem } from "../../store/slices/items";

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <Grid key={item.id} item xs={12} sm={6} md={4}>
      <Card>
        <CardMedia
          component="img"
          // height="100"
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
            onClick={() => {
              dispatch(deleteItem(item.id));
            }}
          >
            DELETE
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ItemCard;
