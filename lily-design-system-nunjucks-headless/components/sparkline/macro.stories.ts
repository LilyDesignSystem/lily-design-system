import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="sparkline"
  role="img" aria-label="Rising"><svg viewBox="0 0 80 24" width="80" height="24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="currentColor" stroke-width="1.5" points="0,24 26.666666666666668,12 53.333333333333336,18 80,0"/></svg></span>`;

const meta = {
    title: "Headless/Sparkline",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
