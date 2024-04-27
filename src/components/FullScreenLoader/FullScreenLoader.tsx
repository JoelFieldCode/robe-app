import { Loader2 } from "lucide-react";
import React from "react";

export const FullScreenLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-12 w-12 animate-spin" />
  </div>
);
