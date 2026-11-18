import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="al-imarat-raqm-al-huwiyah-view"
  aria-label="Emirates ID number"
>sample-value</span>`;

const meta = {
    title: "Headless/AlImaratRaqmAlHuwiyahView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
