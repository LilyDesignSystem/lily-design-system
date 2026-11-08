import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="care-card"
  role="note"
  data-type="non-urgent">  <div class="care-card-body">  </div>
</div>`;

const meta = {
    title: "Headless/CareCard",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
