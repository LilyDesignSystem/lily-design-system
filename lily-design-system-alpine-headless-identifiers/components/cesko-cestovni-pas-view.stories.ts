import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="cesko-cestovni-pas-view"><span class="screen-reader-span">Czech Passport </span></span>';

const meta = {
    title: "Headless/Cesko Cestovni Pas View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
