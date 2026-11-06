import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="sparkline"
  role="img"
  aria-label=""
>
  <!-- Consumer provides content -->
</span>`;

const meta = {
    title: "Headless/Sparkline",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
