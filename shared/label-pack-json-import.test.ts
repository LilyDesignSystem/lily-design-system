import { describe, expect, it } from "vitest";
import { labelsFor } from "./label-pack.ts";
import en from "./label-packs/en-001.json" with { type: "json" };
import ar from "./label-packs/ar-001.json" with { type: "json" };

// P51-T6: the documented call, with a pack imported straight from JSON (so `direction` is `string`), must type-check under strict TypeScript.
describe("labelsFor with a JSON-imported pack", () => {
    it("accepts the pack without a cast", () => {
        expect(labelsFor("calendar", en)).toBeTypeOf("object");
        expect(labelsFor("calendar", ar)).toBeTypeOf("object");
    });
});
