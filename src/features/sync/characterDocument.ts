import { stripExtraConcentrationIds } from "../characters/concentration";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import {
  campaignItems,
  campaignNotes,
  characterArmor,
  characterClasses,
  characterCustomResources,
  characterFeats,
  characterGearItems,
  characterMagicItems,
  characterResourceOverrides,
  characterResourceUses,
  characterSpells,
  characterWeapons,
  characters,
  feats,
  magicItems,
  spellSlots,
  spells,
} from "../../db/schema";
import type { Character } from "../../types/models";

/**
 * A character plus everything "owned by" it, serialized as one JSON
 * document for cloud sync -- see the sync plan's rationale: local child
 * tables have no per-row updatedAt to diff against, so sync happens at
 * whole-character granularity rather than a relational row-by-row mirror.
 * Catalog-linked rows (spells/feats/magic items) carry the
 * catalog's stable `slug`/identity fields rather than the local
 * autoincrement id, since that id isn't portable across devices.
 */
export type CharacterDocument = {
  character: Omit<Character, "id" | "syncId" | "createdAt" | "updatedAt">;
  classes: { classId: string; className: string; level: number; subclass: string; sortOrder: number }[];
  spellSlots: { level: number; total: number; used: number }[];
  spells: { slug: string | null; name: string; level: number; prepared: boolean }[];
  weapons: {
    catalogId: string | null;
    name: string;
    category: string;
    cost: string;
    damageDice: string;
    damageType: string;
    weight: number;
    properties: string;
    description: string;
    equipped: boolean;
    isMagic: boolean;
    magicBonus: number;
    quantity: number;
  }[];
  gearItems: { name: string; quantity: number; description: string }[];
  armor: {
    catalogId: string | null;
    name: string;
    category: string;
    cost: string;
    baseArmorClass: number;
    dexModifier: string;
    strengthRequirement: number | null;
    stealthDisadvantage: boolean;
    weight: number;
    description: string;
    equipped: boolean;
    isMagic: boolean;
    magicBonus: number;
  }[];
  campaignNotes: { subject: string; body: string; createdAt: string; updatedAt: string }[];
  campaignItems: { name: string; description: string; icon: string }[];
  feats: {
    slug: string | null;
    name: string;
    prerequisite: string;
    description: string;
    sourceName: string;
    enabled: boolean;
    effects: string;
  }[];
  magicItemsOwned: {
    slug: string | null;
    name: string;
    category: string;
    rarity: string;
    requiresAttunement: boolean;
    attuned: boolean;
    equipped: boolean;
    description: string;
  }[];
  resourceUses: { resourceId: string; usesRemaining: number }[];
  customResources: {
    name: string;
    description: string;
    maxMode: string;
    fixedMax: number;
    usesByLevel: string;
    ability: string;
    abilityBonus: number;
    abilityMinimum: number;
    rechargeOn: string;
    isPointPool: boolean;
    icon: string;
    rollFormula: string;
    sortOrder: number;
  }[];
  resourceOverrides: { resourceId: string; hidden: boolean; maxOverride: number | null }[];
};

export async function buildCharacterDocument(characterId: number): Promise<CharacterDocument | undefined> {
  const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
  if (!character) return undefined;

  const { id: _id, syncId: _syncId, createdAt: _createdAt, updatedAt: _updatedAt, ...characterRest } = character;

  const [
    classRows,
    slotRows,
    spellRows,
    weaponRows,
    gearRows,
    armorRows,
    noteRows,
    campaignItemRows,
    featRows,
    magicItemRows,
    resourceUseRows,
    customResourceRows,
    overrideRows,
  ] = await Promise.all([
    db.select().from(characterClasses).where(eq(characterClasses.characterId, characterId)),
    db.select().from(spellSlots).where(eq(spellSlots.characterId, characterId)),
    db
      .select({
        slug: spells.slug,
        name: spells.name,
        level: spells.level,
        prepared: characterSpells.prepared,
      })
      .from(characterSpells)
      .innerJoin(spells, eq(characterSpells.spellId, spells.id))
      .where(eq(characterSpells.characterId, characterId)),
    db.select().from(characterWeapons).where(eq(characterWeapons.characterId, characterId)),
    db.select().from(characterGearItems).where(eq(characterGearItems.characterId, characterId)),
    db.select().from(characterArmor).where(eq(characterArmor.characterId, characterId)),
    db.select().from(campaignNotes).where(eq(campaignNotes.characterId, characterId)),
    db.select().from(campaignItems).where(eq(campaignItems.characterId, characterId)),
    db
      .select({
        slug: feats.slug,
        name: characterFeats.name,
        prerequisite: characterFeats.prerequisite,
        description: characterFeats.description,
        sourceName: characterFeats.sourceName,
        enabled: characterFeats.enabled,
        effects: characterFeats.effects,
      })
      .from(characterFeats)
      .leftJoin(feats, eq(characterFeats.catalogFeatId, feats.id))
      .where(eq(characterFeats.characterId, characterId)),
    db
      .select({
        slug: magicItems.slug,
        name: characterMagicItems.name,
        category: characterMagicItems.category,
        rarity: characterMagicItems.rarity,
        requiresAttunement: characterMagicItems.requiresAttunement,
        attuned: characterMagicItems.attuned,
        equipped: characterMagicItems.equipped,
        description: characterMagicItems.description,
      })
      .from(characterMagicItems)
      .leftJoin(magicItems, eq(characterMagicItems.catalogId, magicItems.id))
      .where(eq(characterMagicItems.characterId, characterId)),
    db.select().from(characterResourceUses).where(eq(characterResourceUses.characterId, characterId)),
    db.select().from(characterCustomResources).where(eq(characterCustomResources.characterId, characterId)),
    db.select().from(characterResourceOverrides).where(eq(characterResourceOverrides.characterId, characterId)),
  ]);

  return {
    character: characterRest,
    classes: classRows.map((r) => ({
      classId: r.classId,
      className: r.className,
      level: r.level,
      subclass: r.subclass,
      sortOrder: r.sortOrder,
    })),
    spellSlots: slotRows.map((r) => ({ level: r.level, total: r.total, used: r.used })),
    spells: spellRows,
    weapons: weaponRows.map((r) => ({
      catalogId: r.catalogId,
      name: r.name,
      category: r.category,
      cost: r.cost,
      damageDice: r.damageDice,
      damageType: r.damageType,
      weight: r.weight,
      properties: r.properties,
      description: r.description,
      equipped: r.equipped,
      isMagic: r.isMagic,
      magicBonus: r.magicBonus,
      quantity: r.quantity,
    })),
    gearItems: gearRows.map((r) => ({ name: r.name, quantity: r.quantity, description: r.description })),
    armor: armorRows.map((r) => ({
      catalogId: r.catalogId,
      name: r.name,
      category: r.category,
      cost: r.cost,
      baseArmorClass: r.baseArmorClass,
      dexModifier: r.dexModifier,
      strengthRequirement: r.strengthRequirement,
      stealthDisadvantage: r.stealthDisadvantage,
      weight: r.weight,
      description: r.description,
      equipped: r.equipped,
      isMagic: r.isMagic,
      magicBonus: r.magicBonus,
    })),
    campaignNotes: noteRows.map((r) => ({
      subject: r.subject,
      body: r.body,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
    campaignItems: campaignItemRows.map((r) => ({ name: r.name, description: r.description, icon: r.icon })),
    feats: featRows,
    magicItemsOwned: magicItemRows,
    resourceUses: resourceUseRows.map((r) => ({ resourceId: r.resourceId, usesRemaining: r.usesRemaining })),
    customResources: customResourceRows.map((r) => ({
      name: r.name,
      description: r.description,
      maxMode: r.maxMode,
      fixedMax: r.fixedMax,
      usesByLevel: r.usesByLevel,
      ability: r.ability,
      abilityBonus: r.abilityBonus,
      abilityMinimum: r.abilityMinimum,
      rechargeOn: r.rechargeOn,
      isPointPool: r.isPointPool,
      icon: r.icon,
      rollFormula: r.rollFormula,
      sortOrder: r.sortOrder,
    })),
    resourceOverrides: overrideRows.map((r) => ({
      resourceId: r.resourceId,
      hidden: r.hidden,
      maxOverride: r.maxOverride,
    })),
  };
}

async function resolveSpellId(slug: string | null, name: string, level: number): Promise<number> {
  if (slug) {
    const [bySlug] = await db.select().from(spells).where(eq(spells.slug, slug));
    if (bySlug) return bySlug.id;
  }
  const [byName] = await db.select().from(spells).where(eq(spells.name, name));
  if (byName) return byName.id;
  const [created] = await db.insert(spells).values({ name, level, slug }).returning();
  return created.id;
}

async function resolveFeatCatalogId(slug: string | null): Promise<number | null> {
  if (!slug) return null;
  const [row] = await db.select().from(feats).where(eq(feats.slug, slug));
  return row?.id ?? null;
}

async function resolveMagicItemCatalogId(slug: string | null): Promise<number | null> {
  if (!slug) return null;
  const [row] = await db.select().from(magicItems).where(eq(magicItems.slug, slug));
  return row?.id ?? null;
}

/**
 * Writes a cloud document as a brand-new local character (first pull of a
 * character this device has never seen) and returns its new local id.
 * Known fidelity gaps, accepted for sync's scope: `concentratingSpellId`
 * (references a character_spells row, which gets new local ids here, so
 * it's dropped -- `concentratingSpellName` alone still shows correctly) and
 * `dice_roll_history`/`dm_party_initiative` (not synced at all -- local-only
 * bookkeeping, not "the character").
 */
export async function createCharacterFromDocument(doc: CharacterDocument, syncId: string): Promise<number> {
  const [row] = await db
    .insert(characters)
    .values({
      ...doc.character,
      concentratingSpellId: null,
      extraConcentrations: stripExtraConcentrationIds(doc.character.extraConcentrations),
      syncId,
    })
    .returning();
  const characterId = row.id;
  await writeCharacterChildren(characterId, doc);
  return characterId;
}

/** Overwrites an existing local character's scalar fields + every sync-managed child table from a (newer) cloud document. */
export async function applyCharacterDocument(characterId: number, doc: CharacterDocument): Promise<void> {
  await db
    .update(characters)
    .set({
      ...doc.character,
      concentratingSpellId: null,
      extraConcentrations: stripExtraConcentrationIds(doc.character.extraConcentrations),
    })
    .where(eq(characters.id, characterId));

  await Promise.all([
    db.delete(characterClasses).where(eq(characterClasses.characterId, characterId)),
    db.delete(spellSlots).where(eq(spellSlots.characterId, characterId)),
    db.delete(characterSpells).where(eq(characterSpells.characterId, characterId)),
    db.delete(characterWeapons).where(eq(characterWeapons.characterId, characterId)),
    db.delete(characterGearItems).where(eq(characterGearItems.characterId, characterId)),
    db.delete(characterArmor).where(eq(characterArmor.characterId, characterId)),
    db.delete(campaignNotes).where(eq(campaignNotes.characterId, characterId)),
    db.delete(campaignItems).where(eq(campaignItems.characterId, characterId)),
    db.delete(characterFeats).where(eq(characterFeats.characterId, characterId)),
    db.delete(characterMagicItems).where(eq(characterMagicItems.characterId, characterId)),
    db.delete(characterResourceUses).where(eq(characterResourceUses.characterId, characterId)),
    db.delete(characterCustomResources).where(eq(characterCustomResources.characterId, characterId)),
    db.delete(characterResourceOverrides).where(eq(characterResourceOverrides.characterId, characterId)),
  ]);

  await writeCharacterChildren(characterId, doc);
}

async function writeCharacterChildren(characterId: number, doc: CharacterDocument): Promise<void> {
  if (doc.classes.length > 0) {
    await db.insert(characterClasses).values(doc.classes.map((c) => ({ characterId, ...c })));
  }
  if (doc.spellSlots.length > 0) {
    await db.insert(spellSlots).values(doc.spellSlots.map((s) => ({ characterId, ...s })));
  }
  for (const spell of doc.spells) {
    const spellId = await resolveSpellId(spell.slug, spell.name, spell.level);
    await db.insert(characterSpells).values({ characterId, spellId, prepared: spell.prepared });
  }
  if (doc.weapons.length > 0) {
    await db.insert(characterWeapons).values(doc.weapons.map((w) => ({ characterId, ...w })));
  }
  if (doc.gearItems.length > 0) {
    await db.insert(characterGearItems).values(doc.gearItems.map((g) => ({ characterId, ...g })));
  }
  if (doc.armor.length > 0) {
    await db.insert(characterArmor).values(
      doc.armor.map((a) => ({ characterId, ...a, strengthRequirement: a.strengthRequirement ?? undefined }))
    );
  }
  if (doc.campaignNotes.length > 0) {
    await db.insert(campaignNotes).values(doc.campaignNotes.map((n) => ({ characterId, ...n })));
  }
  if (doc.campaignItems.length > 0) {
    await db.insert(campaignItems).values(doc.campaignItems.map((i) => ({ characterId, ...i })));
  }
  for (const feat of doc.feats) {
    const catalogFeatId = await resolveFeatCatalogId(feat.slug);
    await db.insert(characterFeats).values({
      characterId,
      catalogFeatId,
      name: feat.name,
      prerequisite: feat.prerequisite,
      description: feat.description,
      sourceName: feat.sourceName,
      enabled: feat.enabled,
      effects: feat.effects,
    });
  }
  for (const item of doc.magicItemsOwned) {
    const catalogId = await resolveMagicItemCatalogId(item.slug);
    await db.insert(characterMagicItems).values({
      characterId,
      catalogId,
      name: item.name,
      category: item.category,
      rarity: item.rarity,
      requiresAttunement: item.requiresAttunement,
      attuned: item.attuned,
      equipped: item.equipped,
      description: item.description,
    });
  }
  if (doc.resourceUses.length > 0) {
    await db.insert(characterResourceUses).values(doc.resourceUses.map((r) => ({ characterId, ...r })));
  }
  if (doc.customResources.length > 0) {
    await db.insert(characterCustomResources).values(doc.customResources.map((r) => ({ characterId, ...r })));
  }
  if (doc.resourceOverrides.length > 0) {
    await db.insert(characterResourceOverrides).values(
      doc.resourceOverrides.map((r) => ({ characterId, ...r, maxOverride: r.maxOverride ?? undefined }))
    );
  }
}
