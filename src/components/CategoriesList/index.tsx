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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Category } from "../../models/Category";
import {
  deleteItem,
  fetchItems,
  selectItemsByCategory,
} from "../../store/slices/items";
import BackIcon from "@material-ui/icons/ArrowBackIos";

const CategoriesList: React.FC<{
  categories: Category[];
  viewedCategoryId: number | null;
  setViewedCategoryId: (categoryId: number | null) => void;
}> = ({ categories, viewedCategoryId, setViewedCategoryId }) => {
  const dispatch = useDispatch();
  const selectedCategory = categories.find(
    (category) => category.id === viewedCategoryId
  );
  const categoryItems = useSelector(
    selectItemsByCategory(selectedCategory?.id!)
  );
  useEffect(() => {
    dispatch(fetchItems());
  }, []);
  return !selectedCategory ? (
    <>
      <Typography gutterBottom variant="h6">
        Your categories
      </Typography>
      <div>
        <Grid container spacing={2}>
          {categories.map((category) => {
            return (
              <Grid
                key={category.id}
                style={{ cursor: "pointer" }}
                onClick={() => setViewedCategoryId(category.id)}
                item
                xs={6}
                sm={4}
              >
                <Card>
                  <CardContent>
                    <Typography align="center">{category.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  ) : (
    <>
      <Typography gutterBottom>{selectedCategory.name}</Typography>
      <Box mb={2}>
        <Button
          onClick={() => setViewedCategoryId(null)}
          variant="text"
          color="primary"
          startIcon={<BackIcon />}
        >
          Back
        </Button>
      </Box>
      <Grid container spacing={2}>
        {!categoryItems.length && (
          <Typography>
            You haven't added any items to this category yet.
          </Typography>
        )}
        {categoryItems.map((item) => {
          return (
            <Grid key={item.id} item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image_url}
                  style={{ objectFit: "contain" }}
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
        })}
      </Grid>
    </>
  );
};

export default CategoriesList;
