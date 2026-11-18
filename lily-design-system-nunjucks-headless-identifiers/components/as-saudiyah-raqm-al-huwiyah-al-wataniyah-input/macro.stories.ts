import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="National Identification Number">`;

const meta = {
    title: "Headless/AsSaudiyahRaqmAlHuwiyahAlWataniyahInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
