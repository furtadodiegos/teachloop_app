// apps/app/lib/convexClient.ts
import { ConvexReactClient } from "convex/react";
import { api } from "@myteachloop/backend/_generated/api";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "EXPO_PUBLIC_CONVEX_URL is not set. Did you create apps/app/.env.local?"
  );
}

// Cliente compartilhado do Convex para o app inteiro
export const convex = new ConvexReactClient(convexUrl);

// Reexporta a API gerada para ficar fácil de importar
export { api };
