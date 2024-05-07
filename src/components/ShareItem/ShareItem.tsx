import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { useShareImageStore } from "../../store/shareImageStore";
import * as Sentry from "@sentry/react";

export const isValidUrlWithCatch = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

navigator.serviceWorker.onmessage = function (event) {
  if (event.data?.action === "load-image") {
    const image = event.data.file ?? null;
    const title = event.data.title ?? null;
    const text = event.data.text ?? null;
    const url = event.data.url ?? null;
    useShareImageStore.setState({ image, title, url, text });
  }
};

// TODO give up after 5 seconds or so and show an error or take you to
// item form with nothing prefilled?
export const ShareItem = () => {
  const navigate = useNavigate();
  const { image, title, url, text } = useShareImageStore();
  const hasDataFromSW = !!image || !!title || !!url || !!text;

  useEffect(() => {
    if (image || title || url || text) {
      Sentry.captureEvent({
        message: "Shared item",
        level: "debug",
        extra: { title, url, text },
      });
      navigate(`/items/create`, { replace: true });
    }
  }, [image, title, url, text]);

  if (!hasDataFromSW) return <FullScreenLoader />;

  return null;
};
