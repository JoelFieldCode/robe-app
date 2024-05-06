import React, { createContext, ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import CategoriesList from "./components/CategoriesList";
import Header from "./components/Header";
import CategoryDetail from "./components/CategoryDetail";
import ItemForm from "./components/ItemForm";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { Button } from "./@/components/ui/button";
import { ShareItem } from "./components/ShareItem/ShareItem";
import { WithDefaultParams } from "./components/ItemForm/WithDefaultParams";

SuperTokens.init({
  appInfo: {
    appName: "Robe",
    apiDomain: import.meta.env.VITE_API_URL,
    websiteDomain: window.location.origin,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
});

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

export const FileListenerContext = createContext<{ image?: File | null }>({
  image: null,
});

// navigator.serviceWorker.onmessage = function (event) {
//   console.log({ event });
//   // window.alert(JSON.stringify(event));
//   const imageBlob = event.data.file;
//   console.log({ imageBlob });
//   // we now have the file data and can for example use it as a source for an img with the id image on our page
//   // const image = document.getElementById("image");
//   // image.src = URL.createObjectURL(imageBlob);
// };

const sw = navigator.serviceWorker;

// const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//     return reader.readAsDataURL(file);
//   });
// };

export let GLOBAL_IMAGE: File | null = null;

navigator.serviceWorker.onmessage = function (event) {
  const imageBlob = event.data.file;
  // window.imageTest = imageBlob;
  console.log({ imageBlob });
  GLOBAL_IMAGE = imageBlob;
};

const WithFileListener = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    console.log({ sw });

    if (sw) {
      window.addEventListener("load", () => {
        sw.addEventListener("message", (event) => {
          console.log({ event });
          const imageBlob = event.data.file;
          console.log({ imageBlob });
          setImage(image);
        });
        sw.onmessage = function (event) {
          console.log({ event });
          // window.alert(JSON.stringify(event));
          const imageBlob = event.data.file;
          console.log({ imageBlob });
          setImage(image);
          // we now have the file data and can for example use it as a source for an img with the id image on our page
          // const image = document.getElementById("image");
          // image.src = URL.createObjectURL(imageBlob);
        };
      });
    }
  });

  console.log({ image });

  return (
    <FileListenerContext.Provider value={{ image }}>
      {children}
    </FileListenerContext.Provider>
  );
};

const queryClient = new QueryClient();

createRoot(document.getElementById("app")!).render(
  <QueryClientProvider client={queryClient}>
    <SuperTokensWrapper>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <SessionAuth>
                <Header />
                <Container>
                  <CategoriesList />
                </Container>
              </SessionAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <SessionAuth>
                <Header />
                <Container>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await Session.signOut();
                      window.location.href = "/auth";
                    }}
                  >
                    Sign out
                  </Button>
                </Container>
              </SessionAuth>
            }
          />
          <Route
            path="categories/:categoryId"
            element={
              <SessionAuth>
                <Header />
                <Container>
                  <CategoryDetail />
                </Container>
              </SessionAuth>
            }
          />
          <Route
            path="test-upload-image"
            element={
              <Container>
                <form
                  className="form flex flex-col gap-3"
                  action="./share-item"
                  encType="multipart/form-data"
                  method="POST"
                >
                  <label htmlFor="file">Select images: </label>
                  <input type="file" id="file" name="file"></input>
                  <Button type="submit">Upload</Button>
                </form>
              </Container>
            }
          />

          <Route
            path="share-item"
            element={
              <SessionAuth>
                <Header />
                <Container>
                  <ShareItem />
                </Container>
              </SessionAuth>
            }
          />
          <Route
            path="items/create"
            element={
              <SessionAuth>
                <Header />
                <Container>
                  <WithDefaultParams>
                    {(itemFormProps) => <ItemForm {...itemFormProps} />}
                  </WithDefaultParams>
                </Container>
              </SessionAuth>
            }
          />
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
            EmailPasswordPreBuiltUI,
          ])}
        </Routes>
      </BrowserRouter>
    </SuperTokensWrapper>
  </QueryClientProvider>
);
