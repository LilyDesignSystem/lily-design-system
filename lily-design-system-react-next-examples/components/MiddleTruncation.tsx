// MiddleTruncation component
//
// A string shortened in the middle to fit the width its container gives it ("report-fi…q3.pdf"), keeping the start and
// the end. The width is measured in the browser (canvas text metrics in the element's own font) and re-measured when the
// container resizes; until then, and on the server, the full text is shown.
//
// The full text always stays in the accessibility tree: the shortened string is aria-hidden and the whole text sits in a
// sibling the consumer visually hides. Screen readers, find-in-page and copy get the real text.
//
// Props:
//   className — string, optional. Consumer class appended after the base class.
//   text — string, required. The full text.
//   ellipsis — string, required. The cut marker. No default: the headless layer ships no text.
//   strategy — "even" | "fixed-end" | "min-end", default "even".
//   end — number, optional. Characters kept at the end for "fixed-end" and "min-end".
//   ...restProps — additional HTML attributes spread onto the root <span>.
//
// Markup:
//   <span class="middle-truncation" data-strategy data-truncated?>
//     <span class="middle-truncation-visual" aria-hidden="true">…</span>
//     <span class="middle-truncation-full">…</span>
//   </span>
//
// Keyboard: none.

import React, { useEffect, useRef, useState } from "react";
import { truncateMiddle, type TruncationStrategy } from "./middle-truncation";

export interface MiddleTruncationProps {
    className?: string;
    /** The full text. */
    text: string;
    /** The cut marker; no default. */
    ellipsis: string;
    /** How the room is shared between start and end. */
    strategy?: TruncationStrategy;
    /** Characters kept at the end for "fixed-end" and "min-end". */
    end?: number;
    [key: string]: unknown;
}

export default function MiddleTruncation({
    className = "",
    text,
    ellipsis,
    strategy = "even",
    end,
    ...restProps
}: MiddleTruncationProps) {
    const root = useRef<HTMLSpanElement>(null);
    const [shown, setShown] = useState<string | null>(null);

    useEffect(() => {
        const el = root.current;
        if (!el) return;
        let context: CanvasRenderingContext2D | null | undefined;

        const recalculate = (): void => {
            const width = el.clientWidth;
            if (context === undefined) context = document.createElement("canvas").getContext("2d");
            if (!context || width <= 0) {
                setShown(null);
                return;
            }
            const style = getComputedStyle(el);
            context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const ctx = context;
            const result = truncateMiddle(text, { ellipsis, strategy, end, maxWidth: width, measure: (s) => ctx.measureText(s).width });
            setShown(result === text ? null : result);
        };

        recalculate();
        if (typeof ResizeObserver === "undefined") return;
        let frame = 0;
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(recalculate);
        });
        observer.observe(el);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [text, ellipsis, strategy, end]);

    return (
        <span
            ref={root}
            className={`middle-truncation ${className}`}
            data-strategy={strategy}
            data-truncated={shown === null ? undefined : ""}
            {...restProps}
        >
            <span className="middle-truncation-visual" aria-hidden="true">{shown ?? text}</span>
            <span className="middle-truncation-full">{text}</span>
        </span>
    );
}
