import { CircularProgress, Grid } from "@material-ui/core";
import React, { useState, createContext, useEffect } from "react";
import API from "../services/Api";
import AuthService from "../services/AuthService";

export const AuthProviderContext = createContext<{ isAuthenticated: boolean }>({
  isAuthenticated: false,
});

const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    AuthService.signin().then((accessToken: string) => {
      API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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
