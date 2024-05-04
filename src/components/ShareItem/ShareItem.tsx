import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";

export const ShareItem = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const name = params.get("name");
  const url = params.get("title");

  useEffect(() => {
    navigate(`/items/create?name=${name}&url=${url}`, { replace: true });
  }, []);

  return <FullScreenLoader />;
};
