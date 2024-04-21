import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import Header from "./components/Header";
import CategoriesList from "./components/CategoriesList";
import { useQuery } from "@tanstack/react-query";
import { grabImages } from "./services/ImageGrabber";
import { uniqueId } from "lodash";
import { ImageMetaPayload } from "./models/Images";
import ImageSelector from "./components/ImageSelector";
import { graphql } from "./gql/gql";
import { client } from "./services/GraphQLClient";
import { ImageSelectorContext } from "./components/ImageSelector/context";
import { IS_CHROME_EXTENSION } from "./utils/env";

const getCategoriesQueryDocument = graphql(/* GraphQL */ `
  query getCategories {
    getCategories {
      name
      id
      image_url
      itemCount
    }
  }
`);

const App: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(IS_CHROME_EXTENSION);
  const [viewedCategoryId, setViewedCategoryId] = useState<null | number>(null);

  const categoriesQuery = useQuery(["categories"], async () =>
    client.request(getCategoriesQueryDocument)
  );

  const onAddItem = useCallback((categoryId: number) => {
    setShowForm(false);
    setViewedCategoryId(categoryId);
  }, []);

  useEffect(() => {
    if (IS_CHROME_EXTENSION) {
      document.documentElement.style.width = "800px";
      document.documentElement.style.height = "600px";
    }
  }, []);

  const categories = categoriesQuery.data?.getCategories;

  const imagesQuery = useQuery<ImageMetaPayload>(["images"], async () => {
    const response = await grabImages();
    const { title, urlName, images } = response;

    return {
      title,
      urlName,
      images: images.map((image) => ({
        url: image,
        id: uniqueId(),
      })),
    };
  });

  if (imagesQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <Grid
        style={{ height: "100%" }}
        container
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    );
  }

  const itemFormProps = {
    initialName: imagesQuery.data?.title ?? "",
    initialUrl: imagesQuery.data?.urlName ?? "",
    categories: categories ?? [],
    onSuccess: onAddItem,
  };

  return (
    <>
      <Header setShowForm={setShowForm} />
      <Container maxWidth={false} style={{ padding: 40, paddingTop: 16 }}>
        <Grid container>
          {showForm ? (
            <Grid item xs>
              {IS_CHROME_EXTENSION ? (
                <ImageSelector images={imagesQuery.data?.images ?? []}>
                  <ImageSelectorContext.Consumer>
                    {({ selectedImage }) => (
                      <ItemForm
                        {...itemFormProps}
                        selectedImage={selectedImage}
                      />
                    )}
                  </ImageSelectorContext.Consumer>
                </ImageSelector>
              ) : (
                <ItemForm {...itemFormProps} />
              )}
            </Grid>
          ) : (
            <Grid item xs>
              <CategoriesList
                viewedCategoryId={viewedCategoryId}
                setViewedCategoryId={setViewedCategoryId}
                categories={categories ?? []}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default App;
