import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="slovensko-pas-view"><span class="screen-reader-span">Slovak Passport </span></span>';

const meta = {
    title: "Headless/Slovensko Pas View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
