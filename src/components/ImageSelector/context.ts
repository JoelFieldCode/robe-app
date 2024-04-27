import { createContext } from "react";
import { ImageMetaPayload } from "../../models/Images";

export const ImageSelectorContext = createContext<{
  selectedImage: string;
} & ImageMetaPayload>({
  selectedImage: "",
  images: [],
  urlName: 'https://www.google.com',
  title: 'test'
});
