import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="norge-fodselsnummer-view"\n  ><span class="screen-reader-span">Norwegian Birth Number </span></span\n>';

const meta = {
    title: "Headless/Norge Fodselsnummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
