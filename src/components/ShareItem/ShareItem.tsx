import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { useShareImageStore } from "../../store/shareImageStore";

/*
  Legacy GET param way. Not sure if this will run if the user shares link directly?
*/
// Perhaps this should instead wait for service worker and fail otherwise?
// export const ShareItem = () => {
//   const navigate = useNavigate();
//   const [params] = useSearchParams();
//   /*
//     URL doesn't always come back
//     Text is sometimes the URL? Maybe we should check with JS to see if it's a URL?
//     The title is always correct though
//   */
//   const title = params.get("title");
//   const text = params.get("text");
//   const url = params.get("url");
//   const urlToUse = text ?? url ?? null;

//   useEffect(() => {
//     // TODO handle if title/URL is null. Shoudn't pass null in the URL..
//     useShareImageStore.setState({
//       title,
//       text,
//       url,
//     });
//     navigate(`/items/create?name=${title}&url=${urlToUse}`, { replace: true });
//   }, []);

//   return <FullScreenLoader />;
// };

export const isValidUrlWithCatch = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

// can we put this somewhere else?
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
      navigate(`/items/create`, { replace: true });
    }
  }, [image, title, url, text]);

  if (!hasDataFromSW) return <FullScreenLoader />;

  return null;
};
