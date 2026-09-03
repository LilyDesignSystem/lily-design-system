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
