import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Category } from "../../models/Category";
import { fetchItems, selectItemsByCategory } from "../../store/slices/items";
import BackIcon from "@material-ui/icons/ArrowBackIos";

const CategoriesList: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
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
      <Grid container spacing={2}>
        {categories.map((category) => {
          return (
            <Grid
              key={category.id}
              onClick={() => setSelectedCategory(category)}
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
    </>
  ) : (
    <>
      <Typography gutterBottom>{selectedCategory.name}</Typography>
      <Box mb={2}>
        <Button
          onClick={() => setSelectedCategory(null)}
          variant="text"
          color="primary"
          startIcon={<BackIcon />}
        >
          Back
        </Button>
      </Box>
      <Grid container spacing={2}>
        {categoryItems.map((item) => {
          return (
            <Grid key={item.id} item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Grid container>
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
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default CategoriesList;
