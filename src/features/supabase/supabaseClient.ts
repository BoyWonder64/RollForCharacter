import "react-native-url-polyfill/auto";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Login/cloud sync are additive on top of an otherwise offline-first app
// (see project decision: optional everywhere) -- a missing .env shouldn't
// crash app boot, since the app must still work with no account at all.
// Screens that touch auth/sync check this flag and show a plain "not set
// up yet" state instead of calling into a client that can't reach anything.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY -- set them in .env " +
      "to enable sign-in and cloud sync. The app still works fully offline without them."
  );
}

// Sessions are kept in plain AsyncStorage rather than SecureStore-encrypted
// storage, matching every other context in this app (theme, settings, etc).
// That's a deliberate tradeoff for a hobby D&D tracker, not an oversight --
// revisit if the app ever stores something more sensitive than a session.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      storage: Platform.OS === "web" ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
