import React, { ReactNode } from "react";

export const FieldContainer = ({ children }: { children: ReactNode }) => (
  <div className="grid w-full max-w-sm items-center gap-1.5">{children}</div>
);
