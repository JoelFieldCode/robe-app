import { CircularProgress, Grid } from "@material-ui/core";
import React, { useState, createContext, useEffect } from "react";
import AuthService from "../services/AuthService";
import { client } from "../services/GraphQLClient";

export const AuthProviderContext = createContext<{ isAuthenticated: boolean }>({
  isAuthenticated: false,
});

const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    AuthService.signin().then((accessToken: string) => {
      client.setHeader("Authorization", `Bearer ${accessToken}`);
      setAuthenticated(true);
    });
  }, [isAuthenticated, setAuthenticated]);
  return (
    <AuthProviderContext.Provider
      value={{
        isAuthenticated,
      }}
    >
      {!isAuthenticated ? (
        <Grid
          style={{ height: "100%" }}
          container
          justify="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      ) : (
        children
      )}
    </AuthProviderContext.Provider>
  );
};

export default AuthProvider;
