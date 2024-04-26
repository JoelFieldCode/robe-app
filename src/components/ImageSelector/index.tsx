import React, { ReactNode, useEffect, useState } from "react";
import { ImageDataPayload } from "../../models/Images";
import { ImageSelectorContext } from "./context";

const ImageSelector: React.FC<{
  images: ImageDataPayload[];
  children: ReactNode;
}> = ({ images, children }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    return <p> No images Found</p>;
  }
  return (
    <div>
      <h4 className="twmb-3 twfont-bold">Select an image</h4>
      <div className="twgrid twgrid-cols-4 twgap-3">
        {images.map((image) => {
          return (
            <div
              key={image.id}
              onClick={() => {
                setSelectedImage(image.url);
              }}
            >
              <img
                className="twcursor-pointer twrounded-md twobject-contain tww-full twh-full"
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
