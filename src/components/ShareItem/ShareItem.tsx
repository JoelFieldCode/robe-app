import { useLocation, useParams } from "react-router-dom";
import React from "react";

export const ShareItem = () => {
  const { search } = useLocation();

  return <>Query Params: {JSON.stringify(search)}</>;
};
