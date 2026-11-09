import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="dial"
  role="slider"
  tabindex="0"
  aria-valuenow="50"
  aria-valuemin="0"
  aria-valuemax="100"
  data-step="1"
  data-value="50" id="volume" aria-label="Volume"></div>`;

const meta = {
    title: "Headless/Dial",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
