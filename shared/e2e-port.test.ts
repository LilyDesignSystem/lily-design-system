import { createServer } from "node:net";
import { describe, expect, test } from "vitest";
import { E2E_HOST, e2ePort, e2eURL } from "./e2e-port";

describe("e2ePort", () => {
    test("picks a free port and hands it down in LILY_E2E_PORT", async () => {
        const env: NodeJS.ProcessEnv = {};
        const port = e2ePort(env);
        expect(env.LILY_E2E_PORT).toBe(String(port));
        // Free: this process can bind it.
        await new Promise<void>((resolve, reject) => {
            const s = createServer().once("error", reject);
            s.listen(port, E2E_HOST, () => s.close(() => resolve()));
        });
    });

    test("a later call (a worker) gets the same port", () => {
        const env: NodeJS.ProcessEnv = {};
        expect(e2ePort(env)).toBe(e2ePort(env));
    });

    test("uses LILY_E2E_PORT when it is set", () => {
        expect(e2ePort({ LILY_E2E_PORT: "4173" })).toBe(4173);
    });

    test("refuses a LILY_E2E_PORT that is not a port", () => {
        for (const bad of ["abc", "0", "70000", "41.5"]) {
            expect(() => e2ePort({ LILY_E2E_PORT: bad })).toThrow(/LILY_E2E_PORT/);
        }
    });

    test("e2eURL names 127.0.0.1, not localhost, so every browser reaches the same server", () => {
        expect(e2eURL(5000)).toBe("http://127.0.0.1:5000");
    });
});
