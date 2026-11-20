import { mkdirSync, writeFileSync } from "node:fs";
import { Bench } from "tinybench";
import { mount, unmount } from "svelte";
import { test } from "vitest";

import RenderFixture from "./RenderFixture.svelte";

const CASES = [
    "native-button",
    "lily-button",
    "native-input",
    "lily-input",
    "native-listbox",
    "lily-listbox",
    "native-table",
    "lily-table",
] as const;

test("render and unmount distributions", { timeout: 120_000 }, async () => {
    const results: Record<string, { mean: number; p95: number; samples: number }> = {};

    for (const variant of CASES) {
        const bench = new Bench({ iterations: 10, time: 400, warmupTime: 100 });
        bench.add(variant, async () => {
            const target = document.createElement("div");
            document.body.append(target);
            const component = mount(RenderFixture, { target, props: { variant } });
            await unmount(component);
            target.remove();
        });
        await bench.run();
        const latency = bench.tasks[0].result?.latency;
        const error = (bench.tasks[0].result as { error?: unknown } | undefined)?.error;
        if (!latency) throw new Error(`${variant}: no result: ${String(error)}`);
        results[variant] = {
            mean: latency.mean,
            p95: latency.p95 ?? latency.max,
            samples: latency.samples?.length ?? 0,
        };
    }

    mkdirSync("reports", { recursive: true });
    writeFileSync("reports/render-benchmark.json", `${JSON.stringify(results, null, 2)}\n`);
});
