import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<time
  class="timer"
  aria-live="polite"  data-mode="countdown"></time>`;

const meta = {
    title: "Headless/Timer",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
