import { cleanup } from "@solidjs/testing-library";
import { afterEach } from "vitest";

afterEach(() => {
    cleanup();
});

// jsdom does not always expose Web Storage (it depends on the document
// origin), and the helper tests exercise localStorage persistence
// directly. Provide a deterministic in-memory implementation so the
// suite runs the same everywhere.
if (typeof globalThis.localStorage === "undefined") {
    class MemoryStorage {
        #map = new Map<string, string>();
        get length() {
            return this.#map.size;
        }
        key(index: number) {
            return [...this.#map.keys()][index] ?? null;
        }
        getItem(key: string) {
            return this.#map.has(key) ? this.#map.get(key)! : null;
        }
        setItem(key: string, value: string) {
            this.#map.set(String(key), String(value));
        }
        removeItem(key: string) {
            this.#map.delete(key);
        }
        clear() {
            this.#map.clear();
        }
    }
    const storage = new MemoryStorage();
    Object.defineProperty(globalThis, "localStorage", {
        value: storage,
        configurable: true,
    });
}

// A picker given a cookieName keeps the choice in a cookie, and jsdom keeps cookies for the whole file, so a
// choice made in one test would start the next. Clear every cookie before each test.
import { beforeEach } from "vitest";
beforeEach(() => {
    if (typeof document === "undefined") return;
    for (const part of document.cookie.split(";")) {
        const name = part.split("=")[0]?.trim();
        if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
    }
});
