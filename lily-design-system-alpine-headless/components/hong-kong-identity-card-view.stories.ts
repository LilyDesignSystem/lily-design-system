import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="hong-kong-identity-card-view"\n  aria-label="Hong Kong Identity Card Number"\n></span>';

const meta = {
    title: "Headless/Hong Kong Identity Card View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
