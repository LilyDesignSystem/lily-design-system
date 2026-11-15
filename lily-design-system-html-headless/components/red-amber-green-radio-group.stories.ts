import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="red-amber-green-radio-group"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
    title: "Headless/RedAmberGreenRadioGroup",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
