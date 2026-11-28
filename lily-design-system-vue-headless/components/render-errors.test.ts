import { render, screen } from "@testing-library/vue";
import { defineComponent, h, onErrorCaptured, ref } from "vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Button from "./Button.vue";

// Render errors (tasks.md P50-T24): Lily catches nothing. An error thrown by a child of a Lily component reaches the
// consumer's onErrorCaptured unchanged, and the component renders no fallback of its own.
const Boom = defineComponent({
    setup() {
        throw new Error("child failed");
    },
});

describe("render errors", () => {
    beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));
    afterEach(() => vi.restoreAllMocks());

    test("a child's error reaches the consumer's onErrorCaptured, unchanged", async () => {
        const seen: Error[] = [];
        const Parent = defineComponent({
            setup() {
                const failed = ref<Error | null>(null);
                onErrorCaptured((error) => {
                    seen.push(error as Error);
                    failed.value = error as Error;
                    return false;
                });
                return () =>
                    failed.value
                        ? h("p", { role: "alert" }, `Caught: ${failed.value.message}`)
                        : h(Button, null, { default: () => h(Boom) });
            },
        });
        render(Parent);
        expect(seen).toHaveLength(1);
        expect(seen[0].message).toBe("child failed");
        expect((await screen.findByRole("alert")).textContent).toBe("Caught: child failed");
    });
});
