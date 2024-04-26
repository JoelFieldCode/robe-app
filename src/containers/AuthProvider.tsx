import { Loader2 } from "lucide-react";
import React, { useState, createContext, useEffect, ReactNode } from "react";
import { graphql } from "../gql/gql";
import AuthService from "../services/AuthService";
import { client } from "../services/GraphQLClient";
import { IS_CHROME_EXTENSION } from "../utils/env";

const loginMutation = graphql(/* GraphQL */ `
  mutation login {
    login {
      token
    }
  }
`);

export const AuthProviderContext = createContext<{ isAuthenticated: boolean }>({
  isAuthenticated: false,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      AuthService.signin().then(async (googleAccessToken) => {
        const response = await client.request({
          document: loginMutation,
          requestHeaders: {
            "google-access-token": googleAccessToken,
          },
        });

        if (!response.login.token) {
          throw new Error("Unauthenticated");
        }
        client.setHeader("Authorization", `Bearer ${response.login.token}`);
        setAuthenticated(true);
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (IS_CHROME_EXTENSION) {
      document.documentElement.style.width = "800px";
      document.documentElement.style.height = "600px";
    }
  }, []);

  return (
    <AuthProviderContext.Provider
      value={{
        isAuthenticated,
      }}
    >
      {!isAuthenticated ? (
        <div className="twflex twitems-center twjustify-center twh-screen">
          <Loader2 className="twh-12 tww-12 twanimate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthProviderContext.Provider>
  );
};

export default AuthProvider;
