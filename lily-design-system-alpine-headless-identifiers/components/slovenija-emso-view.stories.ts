import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="slovenija-emso-view"\n  ><span class="screen-reader-span">Unique Master Citizen Number </span></span\n>';

const meta = {
    title: "Headless/Slovenija Emso View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
