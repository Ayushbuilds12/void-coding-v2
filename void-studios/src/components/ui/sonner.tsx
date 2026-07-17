"use client";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: "hsl(0 0% 4%)",
          border: "1px solid hsl(0 0% 14%)",
          color: "hsl(0 0% 100%)",
        },
      }}
    />
  );
}

export { toast } from "sonner";
