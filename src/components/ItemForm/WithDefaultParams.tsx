import React, { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { ItemFormProps } from ".";

export const WithDefaultParams = ({
  children,
}: {
  children: (itemFormProps: ItemFormProps) => ReactNode;
}) => {
  const [params] = useSearchParams();
  const name = params.get("name");
  const url = params.get("url");

  return <>{children({ defaultName: name, defaultUrl: url })}</>;
};
