import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div class="warning-text">
  <span class="warning-text-icon" aria-hidden="true">!</span>
  <strong class="warning-text-text">
    <span class="screen-reader-span">Warning</span>
    You can be fined up to £5,000 if you do not register.
  </strong>
</div>`;

const meta = {
    title: "Headless/WarningText",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
