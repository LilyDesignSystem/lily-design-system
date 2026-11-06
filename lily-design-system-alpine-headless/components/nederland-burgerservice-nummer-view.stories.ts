import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="nederland-burgerservice-nummer-view"\n  ><span class="screen-reader-span">Citizen Service Number </span></span\n>';

const meta = {
    title: "Headless/Nederland Burgerservice Nummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
