import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="ghana-card-personal-identification-number-view"
  aria-label="Ghana Card PIN">sample-value</span>`;

const meta = {
    title: "Headless/GhanaCardPersonalIdentificationNumberView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
