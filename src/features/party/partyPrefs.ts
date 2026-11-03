import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_PARTY_VISIBILITY, type PartyVisibility } from "./partySnapshot";

const CHARACTER_KEY = "rollforcharacter.party.selectedCharacterId";
const VISIBILITY_KEY = "rollforcharacter.party.visibility";

export async function getSelectedPartyCharacterId(): Promise<number | null> {
  const stored = await AsyncStorage.getItem(CHARACTER_KEY);
  return stored ? Number(stored) : null;
}

export async function setSelectedPartyCharacterId(characterId: number | null): Promise<void> {
  if (characterId === null) {
    await AsyncStorage.removeItem(CHARACTER_KEY);
  } else {
    await AsyncStorage.setItem(CHARACTER_KEY, String(characterId));
  }
}

export async function getPartyVisibility(): Promise<PartyVisibility> {
  const stored = await AsyncStorage.getItem(VISIBILITY_KEY);
  if (!stored) return DEFAULT_PARTY_VISIBILITY;
  try {
    return { ...DEFAULT_PARTY_VISIBILITY, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PARTY_VISIBILITY;
  }
}

export async function setPartyVisibility(visibility: PartyVisibility): Promise<void> {
  await AsyncStorage.setItem(VISIBILITY_KEY, JSON.stringify(visibility));
}
