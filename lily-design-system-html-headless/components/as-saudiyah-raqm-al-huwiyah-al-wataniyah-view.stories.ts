import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-view"
  aria-label="National Identification Number"
>sample-value</span>`;

const meta = {
    title: "Headless/AsSaudiyahRaqmAlHuwiyahAlWataniyahView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
