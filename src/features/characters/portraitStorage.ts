import { File, Paths } from "expo-file-system";

/**
 * Copies a picked image (a `file://` URI from expo-image-picker, which may
 * live in a cache/temp location the OS can reclaim) into the app's
 * persistent document directory under a unique name, and deletes the old
 * portrait file if one is being replaced. Returns the new, stable URI to
 * store on the character.
 */
export async function persistPortrait(pickedUri: string, oldUri?: string | null): Promise<string> {
  const source = new File(pickedUri);
  const extension = source.extension || ".jpg";
  const uniqueName = `portrait-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
  const destination = new File(Paths.document, uniqueName);

  await source.copy(destination);

  if (oldUri) {
    try {
      const old = new File(oldUri);
      if (old.exists) old.delete();
    } catch {
      // Old file already gone or outside our document directory -- not fatal.
    }
  }

  return destination.uri;
}

export function deletePortrait(uri: string | null | undefined): void {
  if (!uri) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Already gone -- nothing to do.
  }
}
