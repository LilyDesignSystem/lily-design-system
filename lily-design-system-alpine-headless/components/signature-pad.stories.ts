import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="signature-pad" role="group" aria-label="Consent signature" aria-describedby="signature-pad-1-attestation" data-outcome="pending">\n  <p class="signature-pad-attestation" id="signature-pad-1-attestation">I confirm I have read and understood the information.</p>\n  <!-- Consumer provides the drawing surface, for example <canvas class="signature-pad-canvas"> -->\n  <p class="signature-pad-typed">\n    <label for="signature-pad-1-typed">Or type your full name</label>\n    <input id="signature-pad-1-typed" type="text" autocomplete="name" name="signature">\n  </p>\n  <p class="signature-pad-outcome">Awaiting signature</p>\n</div>';

const meta = {
    title: "Headless/Signature Pad",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
