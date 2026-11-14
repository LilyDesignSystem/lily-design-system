import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="age-view" data-duration="P23D"><span class="screen-reader-span">Age </span>3 weeks 2 days</span>';

const meta = {
    title: "Headless/Age View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
