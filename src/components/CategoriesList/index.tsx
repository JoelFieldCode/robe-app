import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { Category } from "../../gql/graphql";
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
      <h3 className="twmb-3 twtext-lg twfont-bold">Your categories</h3>
      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            setViewedCategoryId={setViewedCategoryId}
          />
        ))}
      </div>
    </>
  ) : (
    <CategoryDetail
      closeCategory={() => setViewedCategoryId(null)}
      categoryId={selectedCategory.id}
    />
  );
};

export default CategoriesList;
