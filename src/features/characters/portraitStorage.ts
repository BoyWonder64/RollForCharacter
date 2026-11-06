import { Platform } from "react-native";

/**
 * expo-file-system has no web implementation, and the browser has no
 * durable filesystem to copy into anyway. On web we read the picked
 * image (a `blob:` URI from expo-image-picker) into a base64 data URI and
 * store that string directly -- it's self-contained, so there's no
 * separate file to track or delete.
 */
async function persistPortraitWeb(pickedUri: string): Promise<string> {
  const response = await fetch(pickedUri);
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Copies a picked image (a `file://` URI from expo-image-picker, which may
 * live in a cache/temp location the OS can reclaim) into the app's
 * persistent document directory under a unique name, and deletes the old
 * portrait file if one is being replaced. Returns the new, stable URI to
 * store on the character.
 */
export async function persistPortrait(pickedUri: string, oldUri?: string | null): Promise<string> {
  if (Platform.OS === "web") {
    return persistPortraitWeb(pickedUri);
  }

  const { File, Paths } = await import("expo-file-system");
  const isLocalFile = pickedUri.startsWith("file://");
  const cleanUri = pickedUri.split("?")[0];
  const match = /\.[a-zA-Z0-9]{2,5}$/.exec(cleanUri);
  const extension = match ? match[0] : ".jpg";
  const uniqueName = `portrait-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
  const destination = new File(Paths.document, uniqueName);

  let copied = false;
  if (isLocalFile) {
    try {
      new File(pickedUri).copy(destination);
      copied = true;
    } catch (error) {
      console.warn("Portrait file copy failed, falling back to fetch", error);
    }
  }
  if (!copied) {
    // Bundled assets in dev builds resolve to http(s) (Metro) or blob/content
    // URIs that File.copy can't read, so pull the bytes through fetch.
    const response = await fetch(pickedUri);
    if (!response.ok) throw new Error(`Couldn't read image (${response.status})`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!destination.exists) destination.create();
    destination.write(bytes);
  }

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
  // Data URIs (web) carry no separate file to delete.
  if (uri.startsWith("data:")) return;
  if (Platform.OS === "web") return;

  import("expo-file-system").then(({ File }) => {
    try {
      const file = new File(uri);
      if (file.exists) file.delete();
    } catch {
      // Already gone -- nothing to do.
    }
  });
}

/**
 * Persists a bundled sprite portrait (a `require()`d asset) the same way as an
 * uploaded photo, so it syncs, displays and deletes through the one
 * `portraitUri` code path.
 */
export async function persistBundledPortrait(
  assetModule: number,
  oldUri?: string | null
): Promise<string> {
  const { Asset } = await import("expo-asset");
  const [asset] = await Asset.loadAsync(assetModule);
  const uri = asset.localUri ?? asset.uri;
  return persistPortrait(uri, oldUri);
}
