import React, { ReactNode } from "react";
import { ItemFormProps } from ".";
import { useShareImageStore } from "../../store/shareImageStore";

export const WithDefaultParams = ({
  children,
}: {
  children: (itemFormProps: ItemFormProps) => ReactNode;
}) => {
  const { image, title, url, text } = useShareImageStore();
  const urlToUse = text ?? url ?? null;
  return (
    <>
      {children({
        defaultName: title ?? "",
        defaultUrl: urlToUse ?? "",
        defaultImage: image,
      })}
    </>
  );
};
