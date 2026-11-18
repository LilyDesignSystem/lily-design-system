import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="island-kennitala-view"\n  ><span class="screen-reader-span">Personal Identity Code </span></span\n>';

const meta = {
    title: "Headless/Island Kennitala View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
