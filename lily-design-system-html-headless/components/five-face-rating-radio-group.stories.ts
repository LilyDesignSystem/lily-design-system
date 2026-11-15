import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="five-face-rating-radio-group"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
    title: "Headless/FiveFaceRatingRadioGroup",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
