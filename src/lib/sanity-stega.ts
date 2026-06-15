import { stegaClean } from "next-sanity";

export function cleanOptionalString(
  value: string | null | undefined
): string | undefined {
  const cleaned = stegaClean(value);

  if (!cleaned) {
    return undefined;
  }

  return cleaned;
}

export function cleanCommaList(
  value: string | null | undefined
): string[] | undefined {
  const cleaned = cleanOptionalString(value);

  if (!cleaned) {
    return undefined;
  }

  const items = cleaned
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}
