// Normalize a Bangladeshi phone to the 11-digit local format with leading 0 (e.g. "01712345678").
// Accepts inputs like "01712345678", "1712345678", "+8801712345678", "+88 017-1234-5678".
export function normalizeBdPhone(raw: string): string | null {
  const digits = String(raw ?? "").replace(/\D+/g, "");
  if (!digits) return null;

  let local = digits;
  if (local.startsWith("880")) local = local.slice(3);
  if (local.length === 10 && local.startsWith("1")) local = "0" + local;

  // Must now be 11 digits starting with 01 and a valid operator digit (3-9).
  if (!/^01[3-9]\d{8}$/.test(local)) return null;
  return local;
}
