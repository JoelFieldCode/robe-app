import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { Category } from "../../models/Category";
import { selectItemsByCategory } from "../../store/slices/items";

const CategoryCard: React.FC<{
  category: Category;
  setViewedCategoryId: (categoryId: number) => void;
}> = ({ category, setViewedCategoryId }) => {
  const categoryItems = useSelector(selectItemsByCategory(category.id));
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
        <CardMedia
          component="img"
          // height="150"
          image={category.image_url}
          // style={{ objectFit: "contain" }}
        />
        <CardContent style={{ textAlign: "center" }}>
          <Typography align="center">{category.name}</Typography>
          <Typography align="center" variant="caption">
            {categoryItems.length} item{categoryItems.length === 1 ? "" : "s"}{" "}
            added
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoryCard;
