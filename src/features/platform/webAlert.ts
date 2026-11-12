import { Alert, Platform, type AlertButton } from "react-native";

/**
 * react-native-web ships `Alert.alert` as an empty function, so on the web
 * build every confirmation, error message and action menu silently did
 * nothing (a character couldn't be deleted, errors were never shown).
 * This gives the web build working dialogs using the browser's own
 * alert/confirm/prompt. Native platforms are untouched.
 */
export function showWebAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  const text = [title, message].filter(Boolean).join("\n\n");
  const all = buttons ?? [];
  const cancel = all.find((b) => b.style === "cancel");
  const actions = all.filter((b) => b !== cancel);

  // Plain message: zero or one button.
  if (all.length <= 1) {
    window.alert(text);
    all[0]?.onPress?.();
    return;
  }

  // Yes/no question: one action plus Cancel (or two plain buttons).
  if (actions.length === 1 || (actions.length === 2 && !cancel)) {
    const confirmButton = actions[actions.length - 1];
    const declineButton = cancel ?? actions[0];
    const question = `${text}\n\nOK = ${confirmButton.text ?? "OK"}, Cancel = ${declineButton.text ?? "Cancel"}`;
    if (window.confirm(question)) confirmButton.onPress?.();
    else declineButton.onPress?.();
    return;
  }

  // Action menu: several choices. Ask for a number.
  const menu = actions.map((b, i) => `${i + 1}. ${b.text ?? "Option"}`).join("\n");
  const answer = window.prompt(`${text}\n\n${menu}\n\nType a number, or cancel.`);
  const index = answer === null ? -1 : parseInt(answer.trim(), 10) - 1;
  const chosen = actions[index];
  if (chosen) chosen.onPress?.();
  else cancel?.onPress?.();
}

if (Platform.OS === "web" && typeof window !== "undefined") {
  Alert.alert = showWebAlert as typeof Alert.alert;
}
