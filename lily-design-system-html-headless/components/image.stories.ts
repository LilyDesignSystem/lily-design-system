import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<img class="image" src="" alt="Example" />`;

const meta = {
    title: "Headless/Image",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
