import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characters } from "../../db/schema";
import type { Character } from "../../types/models";
import { ABILITY_LABELS, abilityModifier } from "./characterCalculations";

export { ABILITY_LABELS, abilityModifier };

export async function listCharacters(): Promise<Character[]> {
  return db.select().from(characters).orderBy(characters.name);
}

export async function getCharacter(id: number): Promise<Character | undefined> {
  const rows = await db.select().from(characters).where(eq(characters.id, id));
  return rows[0];
}

export async function createCharacter(name: string): Promise<Character> {
  const rows = await db
    .insert(characters)
    .values({ name, maxHp: 10, currentHp: 10 })
    .returning();
  return rows[0];
}

export type OnboardingCharacterInput = {
  name: string;
  ruleset: string;
  race: string;
  className: string;
  background: string;
  level: number;
  maxHp: number;
  armorClass: number;
  speed: number;
  proficiencyBonus: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export async function createCharacterFromOnboarding(
  input: OnboardingCharacterInput
): Promise<Character> {
  const rows = await db
    .insert(characters)
    .values({
      name: input.name,
      ruleset: input.ruleset,
      race: input.race,
      className: input.className,
      background: input.background,
      level: input.level,
      maxHp: input.maxHp,
      currentHp: input.maxHp,
      armorClass: input.armorClass,
      speed: input.speed,
      proficiencyBonus: input.proficiencyBonus,
      strength: input.strength,
      dexterity: input.dexterity,
      constitution: input.constitution,
      intelligence: input.intelligence,
      wisdom: input.wisdom,
      charisma: input.charisma,
    })
    .returning();
  return rows[0];
}

export async function deleteCharacter(id: number): Promise<void> {
  await db.delete(characters).where(eq(characters.id, id));
}

export async function updateCharacter(
  id: number,
  changes: Partial<Omit<Character, "id" | "createdAt">>
): Promise<void> {
  await db
    .update(characters)
    .set({ ...changes, updatedAt: new Date().toISOString() })
    .where(eq(characters.id, id));
}

export async function adjustHp(id: number, delta: number): Promise<void> {
  const character = await getCharacter(id);
  if (!character) return;
  const nextHp = Math.max(0, Math.min(character.maxHp, character.currentHp + delta));
  await updateCharacter(id, { currentHp: nextHp });
}
