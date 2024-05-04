import React, { ReactNode } from "react";
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
import { Button } from "./@/components/ui/button";
import { ShareItem } from "./components/ShareItem/ShareItem";

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
