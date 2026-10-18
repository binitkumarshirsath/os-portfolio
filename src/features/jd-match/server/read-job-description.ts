import "server-only";
import mammoth from "mammoth";
import { extractText } from "unpdf";
import { JD_MATCH_LIMITS } from "@/shared/config/ai";

export type JobDescriptionInput =
  | { ok: true; text: string; label: string; truncated: boolean }
  | { ok: false; code: "invalid_request" | "unsupported_file"; message: string };

const startsWith = (bytes: Uint8Array, signature: string) =>
  [...signature].every((char, index) => bytes[index] === char.charCodeAt(0));

/**
 * Turns an upload into plain text. The extension says what the visitor claims the
 * file is; the first bytes say what it really is. Both must agree, so a renamed
 * executable or archive never reaches a parser.
 */
async function textFromFile(file: File): Promise<string | null> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (extension === "pdf" && startsWith(bytes, "%PDF")) {
    const { text } = await extractText(bytes, { mergePages: true });
    return text;
  }
  if (extension === "docx" && startsWith(bytes, "PK")) {
    const { value } = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
    return value;
  }
  if (extension === "txt" || extension === "md") {
    return new TextDecoder().decode(bytes);
  }
  return null;
}

const unsupported = (message: string): JobDescriptionInput => ({
  ok: false,
  code: "unsupported_file",
  message,
});

/** Reads a JD from an uploaded `file` or a pasted `text` field. Nothing is stored. */
export async function readJobDescription(form: FormData): Promise<JobDescriptionInput> {
  const file = form.get("file");
  const pasted = form.get("text");
  let raw: string;
  let label: string;

  if (file instanceof File && file.size > 0) {
    if (file.size > JD_MATCH_LIMITS.maxFileBytes) {
      return unsupported(
        "That file is over 2 MB. Try pasting the job description instead.",
      );
    }
    try {
      const text = await textFromFile(file);
      if (text === null) {
        return unsupported("Upload a PDF, DOCX or TXT file, or paste the text instead.");
      }
      raw = text;
    } catch {
      return unsupported(
        "That file couldn't be read. Try pasting the job description instead.",
      );
    }
    // Shown back to the visitor in the chat, so keep it short.
    label = file.name.slice(0, 80);
  } else if (typeof pasted === "string") {
    raw = pasted;
    label = "pasted job description";
  } else {
    return {
      ok: false,
      code: "invalid_request",
      message: "Add a file or paste the text.",
    };
  }

  // Collapse PDF line-wrapping noise; models don't need the layout.
  const text = raw
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (text.length < JD_MATCH_LIMITS.minJobDescriptionChars) {
    // Also catches scanned PDFs, which are images with no text layer.
    return unsupported(
      "That doesn't look like a full job description. If it's a scanned PDF, try pasting the text instead.",
    );
  }

  const truncated = text.length > JD_MATCH_LIMITS.maxJobDescriptionChars;
  return {
    ok: true,
    text: text.slice(0, JD_MATCH_LIMITS.maxJobDescriptionChars),
    label,
    truncated,
  };
}
