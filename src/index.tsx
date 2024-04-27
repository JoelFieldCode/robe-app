import React, { ReactNode } from "react";
import * as serviceWorker from "./serviceWorker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./containers/AuthProvider";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CategoriesList from "./components/CategoriesList";
import Header from "./components/Header";
import CategoryDetail from "./components/CategoryDetail";
import ItemForm from "./components/ItemForm";
import { IS_CHROME_EXTENSION } from "./utils/env";
import ImageSelector from "./components/ImageSelector";
import { ImageSelectorContext } from "./components/ImageSelector/context";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Container>
          <CategoriesList />,
        </Container>
      </>
    ),
  },
  {
    path: "categories/:categoryId",
    element: (
      <>
        <Header />
        <Container>
          <CategoryDetail />
        </Container>
      </>
    ),
  },
  {
    path: "items/create",
    element: (
      <>
        <Header withAddButton={false} />
        <Container>
          {IS_CHROME_EXTENSION ? (
            <ImageSelector>
              <ImageSelectorContext.Consumer>
                {({ selectedImage, title, urlName }) => (
                  <ItemForm
                    initialName={title}
                    initialUrl={urlName}
                    selectedImage={selectedImage}
                  />
                )}
              </ImageSelectorContext.Consumer>
            </ImageSelector>
          ) : (
            <ItemForm initialName="" initialUrl="https://www.google.com" />
          )}
        </Container>
      </>
    ),
  },
]);

createRoot(document.getElementById("app")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
