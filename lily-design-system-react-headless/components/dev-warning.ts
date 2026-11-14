/**
 * Warnings for developers, in development only. A missing accessible name is a silent failure in untyped code, so a
 * component reports it here. Messages are English on purpose: they are for the developer, never shown to a user.
 *
 * Silent in production builds and wherever no bundler replaces `process.env.NODE_ENV`. A page can turn every warning
 * off with `globalThis.lilyWarnings = false`. Each message prints once. Spec: spec/testing/index.md#development-warnings.
 */
declare const process: { env: { NODE_ENV?: string } };

const printed = new Set<string>();

/** True in a development build. A bundler replaces `process.env.NODE_ENV`; with no bundler, the read throws. */
function development(): boolean {
    try {
        return process.env.NODE_ENV !== "production";
    } catch {
        return false;
    }
}

function warn(message: string): void {
    if (!development()) return;
    if ((globalThis as { lilyWarnings?: boolean }).lilyWarnings === false) return;
    if (printed.has(message)) return;
    printed.add(message);
    console.warn(`[Lily] ${message}`);
}

/** Warn when a control has no accessible name. Pass every source of a name: `label`, an `aria-labelledby`, and so on. */
export function warnMissingName(component: string, ...names: unknown[]): void {
    if (names.some(Boolean)) return;
    warn(`${component} has no accessible name. Set its label (WCAG 4.1.2).`);
}

/**
 * Warn when a prop that must never be blank is missing, such as an allergy list's status. `why` says what goes wrong
 * without it, so the message is useful on its own.
 */
export function warnMissingProp(
    component: string,
    prop: string,
    value: unknown,
    why: string,
): void {
    if (value !== undefined && value !== null && value !== "") return;
    warn(`${component} has no ${prop}. ${why}`);
}

/** Warn when a deprecated component is used, naming what replaces it. */
export function warnDeprecated(
    component: string,
    replacement: string,
    removalVersion: string,
): void {
    warn(
        `${component} is deprecated and will be removed in ${removalVersion}. Use ${replacement}.`,
    );
}

/** Forget what has been printed. For tests. */
export function resetDevWarnings(): void {
    printed.clear();
}
