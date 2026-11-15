import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="net-promoter-score-radio-group"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
    title: "Headless/NetPromoterScoreRadioGroup",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
