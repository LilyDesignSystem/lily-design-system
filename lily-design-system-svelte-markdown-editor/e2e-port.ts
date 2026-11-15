// A free port for one Playwright run, so a test never reaches another project's server.
//
// Fixed ports let a run test the wrong app: with reuseExistingServer, Playwright reuses whatever answers on the URL, and if
// another project holds 127.0.0.1 while this app's server took ::1, each browser can reach a different one (Firefox reached
// another project's page on 4173 on 2026-11-15; spec/local-ci). Picking a free port on 127.0.0.1 for each run, and binding
// the server to it, makes that impossible, and lets two runs, or React and Nuxt, go at once.
//
// Playwright loads the config again in every worker, so the port is chosen once, in the first process, and handed down in
// LILY_E2E_PORT, which the workers and the web server inherit. Set LILY_E2E_PORT yourself to use a server you started.
//
// Synchronous, through a child Node process, because four of the configs are CommonJS, where top-level await is not allowed.
// Copied into each package by bin/sync-shared-modules; edit this file, never a copy.
import { execFileSync } from "node:child_process";

export const E2E_HOST = "127.0.0.1";

const PICK =
    "const s=require('node:net').createServer();" +
    "s.listen(0,'127.0.0.1',()=>{process.stdout.write(String(s.address().port));s.close()})";

export function e2ePort(env: NodeJS.ProcessEnv = process.env): number {
    const given = env.LILY_E2E_PORT;
    if (given) {
        const port = Number(given);
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new Error(
                `LILY_E2E_PORT must be a port number from 1 to 65535, not ${JSON.stringify(given)}`,
            );
        }
        return port;
    }
    const port = Number(execFileSync(process.execPath, ["-e", PICK], { encoding: "utf8" }));
    env.LILY_E2E_PORT = String(port);
    return port;
}

export function e2eURL(port: number): string {
    return `http://${E2E_HOST}:${port}`;
}
