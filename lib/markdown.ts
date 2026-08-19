import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function mdToHtml(md: string): string {
  return marked.parse(md ?? "", { async: false }) as string;
}

// Split a markdown body into paragraph blocks (used by the About team modal to preserve the current bio[] rendering).
export function mdParagraphs(md: string): string[] {
  return (md ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
