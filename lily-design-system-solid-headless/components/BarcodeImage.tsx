// BarcodeImage component
//
// A barcode-image rendered as an <img> element. The consumer supplies the image
// source (typically a generated SVG, PNG, or data URL representing the
// encoded barcode-image) and the required alt text describing what the barcode-image
// encodes for screen-reader users.
//
// Props:
//   class — string, optional. CSS class name.
//   src — string, required. The barcode-image image source URL or data URL.
//   alt — string, required. Alternative text describing the encoded value.
//   loading — "lazy" | "eager", default undefined. Controls native browser loading behavior.
//   ...restProps — additional HTML attributes spread onto the <img>.
//
// Syntax:
//   <BarcodeImage src="/barcode-image.svg" alt="Order number 12345" />
//
// Accessibility:
//   - alt attribute provides the accessible name for the barcode-image (required)
//   - Screen readers announce the alt text when encountering the image
//
// Internationalization:
//   - The alt prop allows localized text; no hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - alt prop is required to enforce accessibility

import { merge, omit } from "solid-js";
export interface BarcodeImageProps {
    class?: string;
    src: string;
    alt: string;
    loading?: "lazy" | "eager";
    [key: string]: unknown;
}

export default function BarcodeImage(props: BarcodeImageProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "src", "alt", "loading");
    return (
        <img
            class={`barcode-image ${p.class}`}
            src={p.src}
            alt={p.alt}
            loading={p.loading}
            {...restProps}
        />
    );
}
