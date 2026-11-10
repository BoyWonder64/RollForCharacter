import { useMemo, useState } from "react";
import { PixelFrameOverlay } from "../../components/PixelFrame";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text, TextInput } from "../../components/AppText";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import { useAuth, type OAuthProvider } from "./AuthContext";
import { isSupabaseConfigured } from "../supabase/supabaseClient";
import { syncAll } from "../sync/syncEngine";
import { withAlpha, BOX_ALPHA } from "../../theme/alpha";

export function AccountSection() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { user, loading, signUp, signIn, signInWithProvider, signOut } = useAuth();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<OAuthProvider | null>(null);

  async function handleOAuth(provider: OAuthProvider) {
    setOauthProvider(provider);
    try {
      await signInWithProvider(provider);
    } catch (err) {
      Alert.alert("Couldn't sign in", err instanceof Error ? err.message : "Try again.");
    } finally {
      setOauthProvider(null);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <View style={styles.card}>
        <PixelFrameOverlay />
        <Text style={styles.hint}>
          Cloud sync isn&apos;t set up yet. Your characters stay on this device only until it is.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.card, { alignItems: "center" }]}>
        <PixelFrameOverlay />
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (user) {
    async function handleSyncNow() {
      setSyncing(true);
      try {
        await syncAll();
      } catch (err) {
        Alert.alert("Sync failed", err instanceof Error ? err.message : "Try again.");
      } finally {
        setSyncing(false);
      }
    }

    return (
      <View style={styles.card}>
        <PixelFrameOverlay />
        <Text style={styles.hint}>
          Signed in as {(user.user_metadata?.display_name as string | undefined) ?? user.email}
        </Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.secondaryButton, syncing && styles.disabled]}
            disabled={syncing}
            onPress={handleSyncNow}
          >
            <Text style={styles.secondaryButtonText}>{syncing ? "Syncing…" : "Sync now"}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={signOut}>
            <Text style={[styles.secondaryButtonText, { color: theme.colors.danger }]}>Sign out</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      if (mode === "signUp") await signUp(email.trim(), password, displayName.trim());
      else await signIn(email.trim(), password);
    } catch (err) {
      Alert.alert("Couldn't sign in", err instanceof Error ? err.message : "Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.card}>
      <PixelFrameOverlay />
      <Text style={styles.hint}>
        Sign in to back up your characters to the cloud and sync them across devices. The app
        keeps working fully offline either way.
      </Text>
      {mode === "signUp" && (
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Display name"
          placeholderTextColor={theme.colors.textMuted}
        />
      )}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry
      />
      <Pressable
        style={[styles.primaryButton, submitting && styles.disabled]}
        disabled={submitting}
        onPress={handleSubmit}
      >
        <Text style={styles.primaryButtonText}>{mode === "signIn" ? "Sign in" : "Sign up"}</Text>
      </Pressable>
      <Pressable
        style={{ marginTop: 10, alignItems: "center" }}
        onPress={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
      >
        <Text style={styles.hint}>
          {mode === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </Text>
      </Pressable>

      <View style={styles.row}>
        <Pressable
          style={[styles.secondaryButton, oauthProvider !== null && styles.disabled]}
          disabled={oauthProvider !== null}
          onPress={() => handleOAuth("google")}
        >
          <Text style={styles.secondaryButtonText}>
            {oauthProvider === "google" ? "Opening…" : "Continue with Google"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, oauthProvider !== null && styles.disabled]}
          disabled={oauthProvider !== null}
          onPress={() => handleOAuth("facebook")}
        >
          <Text style={styles.secondaryButtonText}>
            {oauthProvider === "facebook" ? "Opening…" : "Continue with Facebook"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: withAlpha(theme.colors.surface, BOX_ALPHA),
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      gap: 8,
    },
    hint: { color: theme.colors.textMuted, fontSize: 12 },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      color: theme.colors.text,
    },
    row: { flexDirection: "row", gap: 8, marginTop: 4 },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      padding: 12,
      alignItems: "center",
      marginTop: 4,
    },
    primaryButtonText: { color: theme.colors.primaryText, fontWeight: "700" },
    secondaryButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      alignItems: "center",
    },
    secondaryButtonText: { color: theme.colors.text, fontWeight: "600" },
    disabled: { opacity: 0.6 },
  });
}
