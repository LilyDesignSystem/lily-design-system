# QrCodeImage

## Overview

A headless container for displaying a QR code (two-dimensional barcode-image) that
encodes data such as URLs, text, contact information, or other machine-readable
content. It renders a <div> with role="img" and a required aria-label so screen
reader users understand what the QR code represents. The consumer provides the
actual QR code rendering (SVG, canvas, or third-party library output) as
children. Commonly used for sharing links, mobile payments, event check-ins,
and authentication workflows.

## What it does

A QR code image generated from text or URL data.

## When to use

- Use when you need a QR code image generated from text or URL data.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<QrCodeImage label="Scan to visit example.com">{qrSvg}</QrCodeImage>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible description of the QR code content via aria-label. |
| `children` | Snippet, required | QR code rendering (SVG, canvas, or other visual output). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- QR code with SVG rendering -->
<QrCodeImage label="Scan to visit example.com">
  <svg><!-- QR code SVG paths --></svg>
</QrCodeImage>

<!-- QR code with canvas rendering -->
<QrCodeImage label="Scan to download the app">
  <canvas bind:this={qrCanvas}></canvas>
</QrCodeImage>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import QrCodeImage from "$lib/components/QrCodeImage/QrCodeImage.svelte";
</script>

<QrCodeImage label="Scan to visit example.com">{qrSvg}</QrCodeImage>
```

## Keyboard

- None — this is a passive display container with no interactive behavior.

## Accessibility

- role="img" identifies the container as an image for assistive technologies
- aria-label provides an accessible description of the encoded content
- Screen reader users hear the label instead of seeing the visual barcode-image

## Internationalization

- The label prop is the only user-facing text; no hardcoded strings
- Label should describe the encoded content, not "QR code" generically

## References

- WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img
