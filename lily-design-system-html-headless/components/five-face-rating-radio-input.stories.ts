import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="five-face-rating-radio-input"
  type="radio"
  aria-label=""
>`;

const meta = {
    title: "Headless/FiveFaceRatingRadioInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
