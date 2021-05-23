import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import { useQuery } from "react-query";
import API from "../../services/Api";
import { Category } from "../../models/Category";
import ItemCard from "../ItemCard";
import Item from "../../models/Item";

const CategoryDetail = ({
  category,
  closeCategory,
}: {
  category: Category;
  closeCategory: () => void;
}) => {
  const { isLoading, isSuccess, data } = useQuery<Item[]>(
    ["category-items", category.id],
    () =>
      API.get<Item[]>(`/api/categories/${category.id}/items`).then(
        (resp) => resp.data
      )
  );

  return (
    <>
      <Typography gutterBottom>{category.name}</Typography>
      <Box mb={2}>
        <Button
          onClick={() => closeCategory()}
          variant="text"
          color="primary"
          startIcon={<BackIcon />}
        >
          Back
        </Button>
      </Box>
      <Grid container spacing={2}>
        {isLoading && (
          <Grid
            style={{ height: "100%" }}
            container
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid>
        )}
        {!isLoading &&
          isSuccess &&
          (!data?.length ? (
            <Typography>
              You haven't added any items to this category yet.
            </Typography>
          ) : (
            <>
              {data?.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </>
          ))}
      </Grid>
    </>
  );
};

export default CategoryDetail;
