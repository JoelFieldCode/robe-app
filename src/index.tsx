import React, { ReactNode } from "react";
import * as serviceWorker from "./serviceWorker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import CategoriesList from "./components/CategoriesList";
import Header from "./components/Header";
import CategoryDetail from "./components/CategoryDetail";
import ItemForm from "./components/ItemForm";
import { IS_CHROME_EXTENSION } from "./utils/env";
import ImageSelector from "./components/ImageSelector";
import { ImageSelectorContext } from "./components/ImageSelector/context";

import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";

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
                  <CategoriesList />,
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
            path="items/create"
            element={
              <SessionAuth>
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
                    <ItemForm initialName="" initialUrl={null} />
                  )}
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
