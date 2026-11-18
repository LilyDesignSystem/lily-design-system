import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="al-imarat-raqm-al-huwiyah-input"
  type="text"
  aria-label="Emirates ID number"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/AlImaratRaqmAlHuwiyahInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
