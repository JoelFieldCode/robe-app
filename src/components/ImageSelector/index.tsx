import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { ReactNode, useEffect, useState } from "react";
import { ImageDataPayload } from "../../models/Images";
import { ImageSelectorContext } from "./context";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    width: "100%",
    margin: "0 auto",
  },
  image: {
    cursor: "pointer",
    borderRadius: "6px",
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
}));

const ImageSelector: React.FC<{
  images: ImageDataPayload[];
  children: ReactNode;
}> = ({ images, children }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const classes = useStyles();

  useEffect(() => {
    if (!selectedImage) {
      document.documentElement.style.width = "800px";
      document.documentElement.style.height = "600px";
    } else {
      document.documentElement.style.width = "400px";
      document.documentElement.style.height = "400px";
    }
    return () => {
      document.documentElement.style.width = "400px";
      document.documentElement.style.height = "400px";
    };
  }, [selectedImage]);

  if (selectedImage) {
    return (
      <ImageSelectorContext.Provider value={{ selectedImage }}>
        {children}
      </ImageSelectorContext.Provider>
    );
  }

  if (!images.length) {
    return <Typography> No images Found</Typography>;
  }
  return (
    <div className={classes.container}>
      <Typography variant="h6" gutterBottom>
        Select an image
      </Typography>
      <Grid container spacing={2}>
        {images.map((image) => {
          return (
            <Grid
              item
              key={image.id}
              container
              xs={12}
              sm={3}
              md={3}
              lg={3}
              onClick={() => {
                setSelectedImage(image.url);
              }}
            >
              <img src={image.url} className={classes.image} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default ImageSelector;
