import React, { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return <div className="p-6 mb-16">{children}</div>;
};
