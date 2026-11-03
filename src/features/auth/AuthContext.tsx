import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase/supabaseClient";
import { syncAll } from "../sync/syncEngine";

// Lets a web-based OAuth popup close itself and hand control back to the
// app once the provider redirects -- required once, at module scope.
WebBrowser.maybeCompleteAuthSession();

export type OAuthProvider = "google" | "facebook";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const signedIn = Boolean(session?.user);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Sync is additive/background, never blocking -- fire-and-forget on
  // sign-in and whenever the app comes back to the foreground while signed
  // in. A failed sync (offline, server hiccup) is silently retried on the
  // next trigger rather than surfaced, same spirit as `isSupabaseConfigured`
  // keeping sync entirely optional.
  useEffect(() => {
    if (!signedIn) return;
    syncAll().catch(() => {});

    const subscription = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") syncAll().catch(() => {});
    });
    return () => subscription.remove();
  }, [signedIn]);

  async function signUp(email: string, password: string, displayName: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Same browser-redirect flow for every provider (Google included -- Supabase's
  // own guide steers native apps toward @react-native-google-signin/google-signin
  // for a nicer UI, but that needs a second native dependency and per-provider
  // Google Cloud Console setup; this keeps one code path for both providers).
  // Requires a dev build, not Expo Go -- Expo Go can't register the custom
  // `scheme` the redirect depends on.
  async function signInWithProvider(provider: OAuthProvider) {
    const redirectTo = Linking.createURL("auth/callback");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) throw error;
    if (!data.url) throw new Error("No OAuth URL returned");

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== "success") return;

    const code = new URL(result.url).searchParams.get("code");
    if (!code) throw new Error("No authorization code in the redirect");
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
