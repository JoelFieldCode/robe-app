import React, { ReactNode } from "react";
import * as serviceWorker from "./serviceWorker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./containers/AuthProvider";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CategoriesList from "./components/CategoriesList";
import Header from "./components/Header";
import CategoryDetail from "./components/CategoryDetail";
import ItemForm from "./components/ItemForm";
import { IS_CHROME_EXTENSION } from "./utils/env";
import ImageSelector from "./components/ImageSelector";
import { ImageSelectorContext } from "./components/ImageSelector/context";

// import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
// import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
// import Session from "supertokens-auth-react/recipe/session";

// SuperTokens.init({
//   appInfo: {
//     // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
//     appName: "Robe",
//     apiDomain: "http://localhost:8080",
//     websiteDomain: "http://localhost:3000",
//     apiBasePath: "/auth",
//     websiteBasePath: "/auth",
//   },
//   recipeList: [EmailPassword.init(), Session.init()],
// });

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

const queryClient = new QueryClient();

createRoot(document.getElementById("app")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {/* <SuperTokensWrapper> */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Container>
                  <CategoriesList />,
                </Container>
              </>
            }
          />
          <Route
            path="categories/:categoryId"
            element={
              <>
                <Header />
                <Container>
                  <CategoryDetail />
                </Container>
              </>
            }
          />
          <Route
            path="items/create"
            element={
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
                    <ItemForm
                      initialName=""
                      initialUrl="https://www.google.com"
                    />
                  )}
                </Container>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
      {/* </SuperTokensWrapper> */}
    </AuthProvider>
  </QueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
