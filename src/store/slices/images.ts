import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { uniqueId } from "lodash";
import { grabImages } from "../../services/ImageGrabber";
import { RootState } from "../createReducer";

const imagesAdapter = createEntityAdapter<ImageDataPayload>();

export interface ImageMetaPayload {
  images: ImageDataPayload[];
  urlName: string;
  title: string;
}

export interface ImageDataPayload {
  url: string;
  id: string;
}

export type ImageStatus = "LOADING" | "IDLE" | "ERROR";

export const fetchImages = createAsyncThunk<ImageMetaPayload>(
  "images/fetch",
  async () => {
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
  }
);

export const slice = createSlice({
  name: "images",
  initialState: imagesAdapter.getInitialState({
    status: "IDLE" as ImageStatus,
    urlName: null as string | null,
    title: null as string | null,
  }),
  extraReducers: (builder) => {
    builder.addCase(fetchImages.pending, (state) => {
      state.status = "LOADING";
      imagesAdapter.removeAll(state);
      state.urlName = null;
      state.title = null;
    });
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      imagesAdapter.setAll(state, action.payload.images);
      state.urlName = action.payload.urlName;
      state.title = action.payload.title;
      state.status = "IDLE";
    });
  },
  reducers: {},
});

const imagesSelectors = imagesAdapter.getSelectors<RootState>(
  (state) => state.images
);

export const selectImages = (state: RootState) =>
  imagesSelectors.selectAll(state);

export default slice.reducer;
