# Examples — ShareChooser

| File | Shows |
| ---- | ----- |
| [basic.vue](./basic.vue) | Consumer-supplied destinations, the built-in copy item, the announced copy outcome, and the `@share` event. |

Every user-facing string is a prop, including `copyLabel` — the copy item
renders only when you name it, because a default would be hardcoded
English.

The Svelte canonical's `onShare` / `onCopy` / `onNativeShare` callback
props are emitted events here: `@share`, `@copy`, `@native-share`.

---

Lily™ and Lily Design System™ are trademarks.
