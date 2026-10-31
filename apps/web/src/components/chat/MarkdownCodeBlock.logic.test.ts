import { describe, expect, it } from "vite-plus/test";
import { codeForClipboard } from "./MarkdownCodeBlock.logic";

describe("codeForClipboard", () => {
  it.each([
    ["a\nb\n", "a\nb"],
    ["a\n\n", "a\n"],
    ["a", "a"],
    ["", ""],
    ["  x  \n", "  x  "],
  ])("copies %j as %j", (code, expected) => {
    expect(codeForClipboard(code)).toBe(expected);
  });
});
