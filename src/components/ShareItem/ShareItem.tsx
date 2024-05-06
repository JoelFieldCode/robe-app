import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { FileListenerContext, GLOBAL_IMAGE } from "../..";

export const ShareItem = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  /*
    URL doesn't always come back
    Text is sometimes the URL? Should definitely check with JS to see if text or url props
    are actually a URL
    The title is always correct though
  */
  // const [image, setImage] = useState(null);
  console.log(GLOBAL_IMAGE);
  const title = params.get("title");
  const text = params.get("text");
  const url = params.get("url");
  const urlToUse = text ?? url ?? null;

  const { image } = useContext(FileListenerContext);
  console.log({ image });

  // console.log(window.sessionStorage.getItem("image"));

  // navigator.serviceWorker.onmessage = function (event) {
  //   console.log({ event });
  //   const imageBlob = event.data.file;
  //   console.log({ imageBlob });
  //   setImage(imageBlob);
  //   // we now have the file data and can for example use it as a source for an img with the id image on our page
  //   // const image = document.getElementById("image");
  //   // image.src = URL.createObjectURL(imageBlob);
  // };

  useEffect(() => {
    navigate(`/items/create?name=${title}&url=${urlToUse}`, { replace: true });
  }, []);

  // if (GLOBAL_IMAGE) {
  //   return <img src={URL.createObjectURL(GLOBAL_IMAGE)} />;
  // }

  if (!urlToUse) {
    return <>Sorry something went wrong</>;
  }

  return <FullScreenLoader />;

  // debugging
  //   return (
  //     <div className="break-words">
  //       title:{title}, text:{text} url:{url}
  //     </div>
  //   );
};
