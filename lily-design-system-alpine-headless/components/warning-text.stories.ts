import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="warning-text">\n  <span class="warning-text-icon" aria-hidden="true">!</span>\n  <strong class="warning-text-text">\n    <span class="visually-hidden">Warning</span>\n    You can be fined up to £5,000 if you do not register.\n  </strong>\n</div>';

const meta = {
    title: "Headless/Warning Text",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
