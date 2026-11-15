import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="five-star-rating-radio-input"
  type="radio"
  id=""
  name="">`;

const meta = {
    title: "Headless/FiveStarRatingRadioInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
