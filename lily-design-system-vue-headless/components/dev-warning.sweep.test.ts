import { render } from "@testing-library/vue";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import Combobox from "./Combobox.vue";
import DanmarkPersonnummerInput from "./DanmarkPersonnummerInput.vue";
import Dialog from "./Dialog.vue";
import { resetDevWarnings } from "./dev-warning";

const cases = [
    ["Combobox", Combobox],
    ["DanmarkPersonnummerInput", DanmarkPersonnummerInput],
    ["Dialog", Dialog],
] as const;

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
    resetDevWarnings();
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

const lily = () => warn.mock.calls.flat().filter((m) => String(m).startsWith("[Lily]"));

test.each(cases)("%s warns with no name, and not with one", (name, Subject) => {
    render(Subject as never, { props: { label: "Named" } });
    expect(lily()).toEqual([]);
    render(Subject as never, { attrs: { "aria-labelledby": "elsewhere" } });
    expect(lily()).toEqual([]);
    render(Subject as never);
    expect(lily().join()).toContain(`${name} has no accessible name`);
});
