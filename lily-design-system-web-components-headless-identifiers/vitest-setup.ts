// jsdom ships a real, functional CustomElementRegistry, so component
// tests can call `customElements.define(...)` directly — no polyfill
// needed. This file exists as the place future global test fixtures
// belong, matching the sibling catalogs' `vitest-setup.ts` convention.
export {};
