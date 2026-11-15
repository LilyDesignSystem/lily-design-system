#!/usr/bin/env node
// Write tests/colors-parity.json: what the canonical shared/colors.ts computes, for ColorsTests.cs to check the C#
// port against. Run from anywhere: `node tests/write-colors-parity.mjs`; rerun it when shared/colors.ts changes.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as c from "../../shared/colors.ts";

const here = dirname(fileURLToPath(import.meta.url));
const colors = [
    ...new Set([
        ...Object.values(c.CSS_NAMED_COLORS),
        ...c.defaultPalette(),
        "#123456",
        "#fedcba",
        "#7f7f80",
    ]),
];
const out = {
    names: Object.keys(c.CSS_NAMED_COLORS),
    palette: c.defaultPalette(),
    colors: colors.map((hex) => ({
        hex,
        name: c.nameOfColor(hex),
        hsl: c.hexToHsl(hex),
        hsb: c.hexToHsb(hex),
        cmyk: c.hexToCmyk(hex),
        fromHsl: c.hslToHex(c.hexToHsl(hex)),
        fromHsb: c.hsbToHex(c.hexToHsb(hex)),
        fromCmyk: c.cmykToHex(c.hexToCmyk(hex)),
    })),
};
writeFileSync(join(here, "colors-parity.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`wrote tests/colors-parity.json (${out.colors.length} colours)`);
