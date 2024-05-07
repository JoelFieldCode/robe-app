import React, { ReactNode } from "react";
import { ItemFormProps } from ".";
import { useShareImageStore } from "../../store/shareImageStore";

export const isValidUrlWithCatch = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

export const WithDefaultParams = ({
  children,
}: {
  children: (itemFormProps: ItemFormProps) => ReactNode;
}) => {
  const { image, title, url, text } = useShareImageStore();
  //   /*
  //     URL doesn't always come back
  //     Text or Title is sometimes the URL?
  //     There may not actually be a description at all (only text comes back and it's the URL)
  //     Technically if we have the URL we can scrape the page to get the title.
  //   */
  const urlToUse =
    text && isValidUrlWithCatch(text ?? "")
      ? text
      : url && isValidUrlWithCatch(url ?? "")
      ? url
      : "";

  return (
    <>
      {children({
        defaultName: title ?? text ?? "",
        defaultUrl: urlToUse ?? "",
        defaultImage: image,
      })}
    </>
  );
};
