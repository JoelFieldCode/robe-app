import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Category } from "../../models/Category";
import {
  fetchCategoryItems,
  itemStatus,
  selectItemsByCategory,
} from "../../store/slices/items";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import CategoryCard from "../CategoryCard";
import ItemCard from "../ItemCard";

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
  const status = useSelector(itemStatus);
  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchCategoryItems(selectedCategory.id));
    }
  }, [dispatch, selectedCategory]);
  return !selectedCategory ? (
    <>
      <Typography gutterBottom variant="h6">
        Your categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <CategoryCard
            category={category}
            setViewedCategoryId={setViewedCategoryId}
          />
        ))}
      </Grid>
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
        {status === "LOADING" && (
          <Grid
            style={{ height: "100%" }}
            container
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid>
        )}
        {status === "IDLE" && !categoryItems.length && (
          <Typography>
            You haven't added any items to this category yet.
          </Typography>
        )}
        {status === "IDLE" &&
          categoryItems.map((item) => <ItemCard item={item} />)}
      </Grid>
    </>
  );
};

export default CategoriesList;
