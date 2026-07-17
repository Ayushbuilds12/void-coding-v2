"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { authErrorMessage } from "@/lib/firebase-errors";
import { toast } from "@/components/ui/sonner";

export function OAuthButtons({ next }: { next: string }) {
  const { signInGoogle, signInGithub } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState<"google" | "github" | null>(null);

  const handle = async (provider: "google" | "github") => {
    setLoading(provider);
    try {
      if (provider === "google") await signInGoogle();
      else await signInGithub();
      toast.success("Signed in successfully");
      router.push(next);
      router.refresh();
    } catch (e) {
      toast.error(authErrorMessage(e));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" onClick={() => handle("google")} disabled={loading !== null}>
        <GoogleIcon /> Google
      </Button>
      <Button type="button" variant="outline" onClick={() => handle("github")} disabled={loading !== null}>
        <GithubIcon /> GitHub
      </Button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 2.9 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.9 0 9.8-4.1 9.8-9.9 0-.7-.1-1.2-.2-1.7H12z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
