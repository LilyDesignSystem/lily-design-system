// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest";

import { keepAllOpenForPrint, keepOpenForPrint } from "./print-open";

const print = (name: "beforeprint" | "afterprint") => window.dispatchEvent(new Event(name));

function details(open: boolean): HTMLDetailsElement {
    const el = document.createElement("details");
    el.open = open;
    document.body.append(el);
    return el;
}

afterEach(() => {
    document.body.innerHTML = "";
});

describe("keepOpenForPrint", () => {
    test("opens a closed disclosure for print and closes it again afterwards", () => {
        const d = details(false);
        const stop = keepOpenForPrint(() => [d]);
        print("beforeprint");
        expect(d.open).toBe(true);
        print("afterprint");
        expect(d.open).toBe(false);
        stop();
    });

    test("leaves a disclosure the reader had opened open, before and after", () => {
        const d = details(true);
        const stop = keepOpenForPrint(() => [d]);
        print("beforeprint");
        expect(d.open).toBe(true);
        print("afterprint");
        expect(d.open).toBe(true);
        stop();
    });

    test("a second beforeprint with no afterprint in between still restores what the first opened", () => {
        const d = details(false);
        const stop = keepOpenForPrint(() => [d]);
        print("beforeprint");
        print("beforeprint");
        print("afterprint");
        expect(d.open).toBe(false);
        stop();
    });

    test("only closes what it opened: a disclosure opened by the reader during print stays", () => {
        const a = details(false);
        const b = details(false);
        const stop = keepOpenForPrint(() => [a]);
        print("beforeprint");
        b.open = true;
        print("afterprint");
        expect(a.open).toBe(false);
        expect(b.open).toBe(true);
        stop();
    });

    test("an afterprint with no beforeprint does nothing", () => {
        const d = details(true);
        const stop = keepOpenForPrint(() => [d]);
        print("afterprint");
        expect(d.open).toBe(true);
        stop();
    });

    test("the targets are read at print time, so a disclosure added later is opened", () => {
        const list: HTMLDetailsElement[] = [];
        const stop = keepOpenForPrint(() => list);
        const late = details(false);
        list.push(late);
        print("beforeprint");
        expect(late.open).toBe(true);
        print("afterprint");
        stop();
    });

    test("stopping removes the listeners and restores a disclosure that is still open for print", () => {
        const d = details(false);
        const stop = keepOpenForPrint(() => [d]);
        print("beforeprint");
        expect(d.open).toBe(true);
        stop();
        expect(d.open).toBe(false);
        print("beforeprint");
        expect(d.open).toBe(false);
    });
});

describe("keepAllOpenForPrint", () => {
    test("opens every disclosure under the root, including nested ones, and restores them", () => {
        const outer = details(false);
        const inner = document.createElement("details");
        outer.append(inner);
        const open = details(true);
        const stop = keepAllOpenForPrint();
        print("beforeprint");
        expect([outer.open, inner.open, open.open]).toEqual([true, true, true]);
        print("afterprint");
        expect([outer.open, inner.open, open.open]).toEqual([false, false, true]);
        stop();
    });

    test("is limited to the root it is given", () => {
        const inside = document.createElement("div");
        const inner = document.createElement("details");
        inside.append(inner);
        document.body.append(inside);
        const outside = details(false);
        const stop = keepAllOpenForPrint(inside);
        print("beforeprint");
        expect(inner.open).toBe(true);
        expect(outside.open).toBe(false);
        print("afterprint");
        stop();
    });
});
