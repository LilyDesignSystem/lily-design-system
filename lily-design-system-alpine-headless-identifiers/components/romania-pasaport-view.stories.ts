import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="romania-pasaport-view"\n  ><span class="screen-reader-span">Romanian Passport </span></span\n>';

const meta = {
    title: "Headless/Romania Pasaport View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
