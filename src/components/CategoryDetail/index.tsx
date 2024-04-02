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
import ItemCard from "../ItemCard";
import { client } from "../../services/GraphQLClient";
import { graphql } from "../../gql/gql";

const getCategoryDocument = graphql(/* GraphQL */ `
  query getCategory($categoryId: Int!) {
    getCategory(categoryId: $categoryId) {
      id
      name
      image_url
      items {
        id
        name
        image_url
        price
        url
      }
    }
  }
`);

const CategoryDetail = ({
  closeCategory,
  categoryId,
}: {
  categoryId: number;
  closeCategory: () => void;
}) => {
  const { isLoading, isSuccess, data } = useQuery(
    ["categories", categoryId],
    async () =>
      client.request({
        document: getCategoryDocument,
        variables: { categoryId },
      })
  );

  if (isLoading) {
    <Grid
      style={{ height: "100%" }}
      container
      justify="center"
      alignItems="center"
    >
      <CircularProgress />
    </Grid>;
  }

  if (!data?.getCategory) {
    return <>Category not found</>;
  }

  const category = data.getCategory;

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
          (!category.items?.length ? (
            <Typography>
              You haven't added any items to this category yet.
            </Typography>
          ) : (
            <>
              {category.items?.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </>
          ))}
      </Grid>
    </>
  );
};

export default CategoryDetail;
