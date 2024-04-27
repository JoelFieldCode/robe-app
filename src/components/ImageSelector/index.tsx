import { useQuery } from "@tanstack/react-query";
import { uniqueId } from "lodash";
import React, { ReactNode, useEffect, useState } from "react";
import { ImageMetaPayload } from "../../models/Images";
import { grabImages } from "../../services/ImageGrabber";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { ImageSelectorContext } from "./context";

const ImageSelector: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const images = imagesQuery.data?.images ?? [];

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

  if (imagesQuery.isLoading) {
    return <FullScreenLoader />;
  }

  if (imagesQuery.data && selectedImage) {
    return (
      <ImageSelectorContext.Provider
        value={{ selectedImage, ...imagesQuery.data }}
      >
        {children}
      </ImageSelectorContext.Provider>
    );
  }

  if (!images.length) {
    return <p> No images Found</p>;
  }
  return (
    <div>
      <h4 className="mb-3 font-bold">Select an image</h4>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => {
          return (
            <div
              key={image.id}
              onClick={() => {
                setSelectedImage(image.url);
              }}
            >
              <img
                className="cursor-pointer rounded-md object-contain w-full h-full"
                src={image.url}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSelector;
