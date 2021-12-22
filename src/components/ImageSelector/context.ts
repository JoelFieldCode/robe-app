import { createContext } from "react";

export const ImageSelectorContext = createContext<{
  selectedImage: string;
}>({
  selectedImage: "",
});
