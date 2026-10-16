import { afterEach } from "vitest";
import { cleanup } from "@testing-library/vue";

// @testing-library/vue only auto-cleans when vitest globals are on.
afterEach(() => cleanup());

// jsdom does not always expose Web Storage (it depends on the document
// origin), and the helper tests exercise localStorage persistence
// directly. Provide a deterministic in-memory implementation so the
// suite runs the same everywhere.
if (typeof globalThis.localStorage === "undefined") {
  class MemoryStorage {
    #map = new Map();
    get length() {
      return this.#map.size;
    }
    key(index) {
      return [...this.#map.keys()][index] ?? null;
    }
    getItem(key) {
      return this.#map.has(key) ? this.#map.get(key) : null;
    }
    setItem(key, value) {
      this.#map.set(String(key), String(value));
    }
    removeItem(key) {
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
