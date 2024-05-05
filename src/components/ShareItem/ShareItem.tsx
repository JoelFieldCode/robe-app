import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";

export const ShareItem = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  /*
    URL doesn't always come back
    Text is sometimes the URL? Should definitely check with JS to see if text or url props
    are actually a URL
    The title is always correct though
  */
  const title = params.get("title");
  const text = params.get("text");
  const url = params.get("url");
  const urlToUse = text ?? url ?? null;

  useEffect(() => {
    navigate(`/items/create?name=${title}&url=${urlToUse}`, { replace: true });
  }, []);

  if (!urlToUse) {
    <>Sorry something went wrong</>;
  }

  return <FullScreenLoader />;

  // debugging
  //   return (
  //     <div className="break-words">
  //       title:{title}, text:{text} url:{url}
  //     </div>
  //   );
};
