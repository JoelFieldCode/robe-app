export interface ImageMetaPayload {
  images: ImageDataPayload[];
  urlName: string;
  title: string;
  type: "selectImages" | "imageSelected";
}

export interface ImageDataPayload {
  url: string;
  id: string;
}
