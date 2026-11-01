import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input class="hidden-input" type="hidden" name="token" value="abc123" />`;

const meta = {
    title: "Headless/HiddenInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
