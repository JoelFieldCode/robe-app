import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { Category } from "../../models/Category";
import { AppDispatch } from "../../store";
import { deleteCategory } from "../../store/slices/categories";

const CategoryCard: React.FC<{
  category: Category;
  setViewedCategoryId: (categoryId: number) => void;
}> = ({ category, setViewedCategoryId }) => {
  const dispatch: AppDispatch = useDispatch();
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
          image={
            category.item_image_url
              ? category.item_image_url
              : category.image_url
          }
          // style={{ objectFit: "contain" }}
        />
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
              dispatch(deleteCategory(category.id));
            }}
          >
            DELETE
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CategoryCard;
