import { render } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import Combobox from "./Combobox";
import DanmarkPersonnummerInput from "./DanmarkPersonnummerInput";
import Dialog from "./Dialog";
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
    const Any = Subject as never as (props: Record<string, unknown>) => React.JSX.Element;
    render(<Any label="Named">{null}</Any>);
    expect(warn).not.toHaveBeenCalled();
    render(<Any aria-labelledby="elsewhere">{null}</Any>);
    expect(warn).not.toHaveBeenCalled();
    render(<Any>{null}</Any>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`${name} has no accessible name`));
});
