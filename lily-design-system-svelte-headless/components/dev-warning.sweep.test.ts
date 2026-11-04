import { render } from "@testing-library/svelte";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import Combobox from "./Combobox/Combobox.svelte";
import DanmarkPersonnummerInput from "./DanmarkPersonnummerInput/DanmarkPersonnummerInput.svelte";
import Dialog from "./Dialog/Dialog.svelte";
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

test.each(cases)("%s warns with no name, and not with one", (name, Subject) => {
    render(Subject as never, { props: { label: "Named" } as never });
    expect(warn).not.toHaveBeenCalled();
    render(Subject as never, { props: { "aria-labelledby": "elsewhere" } as never });
    expect(warn).not.toHaveBeenCalled();
    render(Subject as never, { props: {} as never });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`${name} has no accessible name`));
});
