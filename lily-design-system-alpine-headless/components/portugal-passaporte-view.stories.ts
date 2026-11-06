import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="portugal-passaporte-view"\n  ><span class="screen-reader-span">Portuguese Passport </span></span\n>';

const meta = {
    title: "Headless/Portugal Passaporte View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
