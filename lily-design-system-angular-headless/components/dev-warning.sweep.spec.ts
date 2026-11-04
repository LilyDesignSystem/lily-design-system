import { TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { Combobox } from "./Combobox";
import { DanmarkPersonnummerInput } from "./DanmarkPersonnummerInput";
import { Dialog } from "./Dialog";
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
    const named = TestBed.createComponent(Subject as never);
    (named.componentRef as { setInput(n: string, v: string): void }).setInput("label", "Named");
    named.detectChanges();
    expect(warn).not.toHaveBeenCalled();

    const blank = TestBed.createComponent(Subject as never);
    blank.detectChanges();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`${name} has no accessible name`));
});
