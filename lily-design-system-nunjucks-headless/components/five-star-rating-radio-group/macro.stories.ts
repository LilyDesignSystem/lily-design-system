import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="five-star-rating-radio-group"
  role="radiogroup"></div>`;

const meta = {
    title: "Headless/FiveStarRatingRadioGroup",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
