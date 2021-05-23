import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { Category } from "../../models/Category";
import CategoryCard from "../CategoryCard";
import CategoryDetail from "../CategoryDetail";

const CategoriesList: React.FC<{
  categories: Category[];
  viewedCategoryId: number | null;
  setViewedCategoryId: (categoryId: number | null) => void;
}> = ({ categories, viewedCategoryId, setViewedCategoryId }) => {
  const selectedCategory = categories.find(
    (category) => category.id === viewedCategoryId
  );
  return !selectedCategory ? (
    <>
      <Typography gutterBottom variant="h6">
        Your categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            setViewedCategoryId={setViewedCategoryId}
          />
        ))}
      </Grid>
    </>
  ) : (
    <CategoryDetail
      closeCategory={() => setViewedCategoryId(null)}
      category={selectedCategory}
    />
  );
};

export default CategoriesList;
