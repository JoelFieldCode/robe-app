export interface ImageMetaPayload {
  images: ImageDataPayload[];
  urlName: string;
  title: string;
}

export interface ImageDataPayload {
  url: string;
  id: string;
}
