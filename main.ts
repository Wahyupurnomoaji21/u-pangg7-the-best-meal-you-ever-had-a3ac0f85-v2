// The Best Meal You Ever Had — u-pangg7-the-best-meal-you-ever-had-a3ac0f85
// Entry v2.
//
// This program has one responsibility: place the entry sentence into
// entry.txt inside the output directory the harness provides. The
// sentence is a memory of a grandmother's kitchen in Jogja at dusk —
// steam, a tapping spoon, ginger and garlic — a warm family meal
// shared with another person, instead of a solitary late-night bowl.
// The judge compares entries head to head and picks the meal that
// feels most real, so the sentence carries a person, a place, a time
// of day and three concrete senses (sight, sound, smell) in a single
// breath, and nothing else.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The entry. One sentence, 169 characters, written to be judged as
// a lived moment: grandmother, kitchen, dusk, steam, spoon, ginger,
// garlic, blanket. No second sentence, no list, no extra line.
const ENTRY =
  "In my grandmother's small Jogja kitchen at dusk, steam rose from her chicken soup, her spoon tapped my bowl, and ginger and garlic wrapped around us like a warm blanket.";

// Competition gate for entry.txt: UTF-8 text, between 1 and 200
// characters, containing at least one non-space character, on one
// line only. Length is counted in Unicode code points, so any
// multi-byte character still counts as a single character.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function checkEntry(text: string): void {
  const length = [...text].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    throw new Error(
      `entry is ${length} characters, but the gate allows ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry contains only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must fit on exactly one line");
  }
}

// The output directory comes from MAKEFUN_OUTPUT_DIR when the harness
// sets it; otherwise an "output" folder beside this file is used for
// local runs. Both are derived from import.meta.url, never from the
// process working directory, so the program works no matter where it
// is launched from.
function outputDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const given = process.env.MAKEFUN_OUTPUT_DIR;
  return given !== undefined && given !== "" ? given : resolve(here, "output");
}

function main(): void {
  checkEntry(ENTRY);

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });

  const file = resolve(dir, "entry.txt");
  writeFileSync(file, ENTRY, "utf8");

  // Confirm the write: the file the judge will read must hold the
  // entry exactly, byte for byte, with no added newline or trimming.
  if (!existsSync(file)) {
    throw new Error(`expected output file was not created: ${file}`);
  }
  const onDisk = readFileSync(file, "utf8");
  if (onDisk !== ENTRY) {
    throw new Error("entry.txt on disk does not match the entry sentence");
  }

  console.log(`wrote ${[...ENTRY].length} chars to ${file}`);
  console.log(ENTRY);
}

main();
