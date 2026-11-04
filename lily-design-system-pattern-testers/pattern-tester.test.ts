// The package's own proof: a small roving container passes, and the same one with a key broken fails.
import { expect, test } from "vitest";

import { runPattern } from "./pattern-tester";

function tablist(moves: Record<string, (index: number, last: number) => number>): HTMLElement {
    document.body.innerHTML = '<div role="tablist" aria-label="Sections"></div>';
    const root = document.body.firstElementChild as HTMLElement;
    root.addEventListener("keydown", (event) => {
        const tabs = [...root.querySelectorAll<HTMLElement>('[role="tab"]')];
        const index = tabs.indexOf(document.activeElement as HTMLElement);
        const move = moves[event.key];
        if (move) tabs[move(index, tabs.length - 1)].focus();
    });
    return root;
}

const keys = {
    ArrowRight: (i: number, last: number) => (i === last ? 0 : i + 1),
    ArrowLeft: (i: number, last: number) => (i === 0 ? last : i - 1),
    Home: () => 0,
    End: (_: number, last: number) => last,
};

test("a tablist that follows the contract passes", async () => {
    await runPattern("tabs", { root: tablist(keys), hook: "tabs" });
});

test("a tablist with End broken fails, naming the step", async () => {
    const root = tablist({ ...keys, End: () => 0 });
    await expect(runPattern("tabs", { root, hook: "tabs" })).rejects.toThrow(/End/);
});
