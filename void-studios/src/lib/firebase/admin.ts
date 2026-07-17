import "server-only";
import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { serverConfig } from "@/lib/config";

let cachedApp: App | null = null;

function getAdminApp(): App | null {
  if (!serverConfig.firebase.adminEnabled || !serverConfig.firebase.serviceAccount) {
    return null;
  }
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApps()[0];
    return cachedApp;
  }
  const sa = serverConfig.firebase.serviceAccount as {
    project_id: string;
    client_email: string;
    private_key: string;
  };
  cachedApp = initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      // Handle escaped newlines commonly present in env-provided keys.
      privateKey: sa.private_key?.replace(/\\n/g, "\n"),
    }),
  });
  return cachedApp;
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  const db = getFirestore(app);
  return db;
}

export const isAdminEnabled = serverConfig.firebase.adminEnabled;
