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
  children: (
    itemFormProps: Pick<
      ItemFormProps,
      "defaultImage" | "defaultUrl" | "defaultName"
    >
  ) => ReactNode;
}) => {
  const { image, title, url, text } = useShareImageStore();
  //   /*
  //     URL doesn't always come back
  //     Text or Title is sometimes the URL?
  //     There may not actually be a description at all (only text comes back and it's the URL)
  //     Technically if we have the URL we can scrape the page to get the title.
  //   */
  const nameToUse = title ?? text ?? "";
  const urlToUse =
    text && isValidUrlWithCatch(text ?? "")
      ? text
      : url && isValidUrlWithCatch(url ?? "")
      ? url
      : "";

  return (
    <>
      {children({
        // sometimes the title/text can be a URL, we don't want to set that as the name
        defaultName: !isValidUrlWithCatch(nameToUse) ? nameToUse : "",
        defaultUrl: urlToUse ?? "",
        defaultImage: image,
      })}
    </>
  );
};
