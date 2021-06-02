import { Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { ImageDataPayload } from "../../models/Images";

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
  setSelectedImage: (image: string) => void;
}> = ({ images, setSelectedImage }) => {
  const classes = useStyles();
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
