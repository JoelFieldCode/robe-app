import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
import CategoriesList from "./components/CategoriesList";
import CategoryDetail from "./components/CategoryDetail";
import ItemForm from "./components/ItemForm";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { SessionAuth } from "supertokens-auth-react/recipe/session";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { Button } from "./@/components/ui/button";
import * as Sentry from "@sentry/react";
import { ShareItem } from "./components/ShareItem/ShareItem";
import { WithDefaultParams } from "./components/ItemForm/WithDefaultParams";
import { TestShareImageForm } from "./components/TestShareImageForm/TestShareImageForm";
import { Footer } from "./components/Footer/Footer";
import { EditCategory } from "./pages/EditCategory";
import { CreateCategory } from "./pages/CreateCategory";
import { ItemDetail } from "./pages/ItemDetail";
import { Container } from "./components/Container";

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

Sentry.init({
  // TODO use .env?
  environment: import.meta.env.MODE,
  enabled: import.meta.env.MODE === "production",
  dsn: "https://b277cfc37eaf2184b97d348f6c429422@o4507217224007680.ingest.us.sentry.io/4507217228267520",
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [],
  // Session Replay
  replaysSessionSampleRate: 0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
                <Container>
                  <CategoriesList />
                </Container>
                <Footer />
              </SessionAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <SessionAuth>
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
                <Footer />
              </SessionAuth>
            }
          />
          <Route
            path="categories/:categoryId"
            element={
              <SessionAuth>
                <Container>
                  <CategoryDetail />
                </Container>
                <Footer />
              </SessionAuth>
            }
          />
          <Route
            path="categories/:categoryId/edit"
            element={
              <SessionAuth>
                <Container>
                  <EditCategory />
                </Container>
                <Footer />
              </SessionAuth>
            }
          />
          <Route
            path="create-category"
            element={
              <SessionAuth>
                <Container>
                  <CreateCategory />
                </Container>
                <Footer />
              </SessionAuth>
            }
          />
          <Route
            path="test-upload-image"
            element={
              <Container>
                <TestShareImageForm />
              </Container>
            }
          />

          <Route
            path="share-item"
            element={
              <Container>
                <ShareItem />
              </Container>
            }
          />
          <Route
            path="items/:itemId"
            element={
              <SessionAuth>
                <ItemDetail />
                <Footer />
              </SessionAuth>
            }
          />
          <Route
            path="items/create"
            element={
              <SessionAuth>
                <Container>
                  <WithDefaultParams>
                    {(itemFormProps) => <ItemForm {...itemFormProps} />}
                  </WithDefaultParams>
                </Container>
                <Footer />
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
