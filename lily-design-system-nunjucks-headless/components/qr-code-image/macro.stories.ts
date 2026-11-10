import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="qr-code-image"
  role="img" aria-label="Scan to visit example.com"><svg viewBox="0 0 21 21"></svg></div>`;

const meta = {
    title: "Headless/QrCodeImage",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
