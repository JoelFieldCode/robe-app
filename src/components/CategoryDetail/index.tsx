import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import { useQuery } from "@tanstack/react-query";
import API from "../../services/Api";
import { Category } from "../../gql/graphql";
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
    ["categories", category.id, "items"],
    () =>
      API.get<Item[]>(`/api/categories/${category.id}/items`).then(
        (resp) => resp.data
      )
  );

  return (
    <>
      <Typography gutterBottom>{category.name}</Typography>
      <div style={{ marginBottom: "8px" }}>
        <Button
          onClick={() => closeCategory()}
          variant="text"
          color="primary"
          startIcon={<BackIcon />}
        >
          Back
        </Button>
      </div>
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
