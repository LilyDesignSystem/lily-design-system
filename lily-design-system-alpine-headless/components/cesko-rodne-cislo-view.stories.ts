import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="cesko-rodne-cislo-view"\n  ><span class="screen-reader-span">Czech Personal Number </span></span\n>';

const meta = {
    title: "Headless/Cesko Rodne Cislo View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
