import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";

export const ShareItem = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const title = params.get("title");
  const text = params.get("text");
  const url = params.get("url");

  //   useEffect(() => {
  //     navigate(`/items/create?name=${name}&url=${url}`, { replace: true });
  //   }, []);

  return (
    <div className="break-words">
      title:{title}, text:{text} url:{url}
    </div>
  );
};
