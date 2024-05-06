import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { useShareImageStore } from "../../store/shareImageStore";

/*
  Legacy GET param way. Not sure if this will run if the user shares link directly?
*/
export const ShareItem = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  /*
    URL doesn't always come back
    Text is sometimes the URL? Maybe we should check with JS to see if it's a URL?
    The title is always correct though
  */
  const title = params.get("title");
  const text = params.get("text");
  const url = params.get("url");
  const urlToUse = text ?? url ?? null;

  useEffect(() => {
    // TODO handle if title/URL is null. Shoudn't pass null in the URL..
    useShareImageStore.setState({
      title,
      text,
      url,
    });
    navigate(`/items/create?name=${title}&url=${urlToUse}`, { replace: true });
  }, []);

  return <FullScreenLoader />;
};
