// A result that is not final must say so in words: the types refuse one that does not (tasks.md P49-T8). Checked by `pnpm check`,
// which fails if a line marked @ts-expect-error compiles.
import type { ComponentProps } from "svelte";

import type ObservationView from "../components/ObservationView/ObservationView.svelte";

type Props = ComponentProps<typeof ObservationView>;

declare const status: "final" | "corrected" | "masked";
declare const words: string;

export const accepted: Props[] = [
    { value: "5" },
    { value: "5", status: "final" },
    { value: "5", status: "corrected", statusLabel: "Corrected" },
    { value: "5", status, statusLabel: words },
];

// @ts-expect-error a corrected result with no words
export const missing: Props = { value: "5", status: "corrected" };

// @ts-expect-error a status that may not be final, with no words
export const perhaps: Props = { value: "5", status };
