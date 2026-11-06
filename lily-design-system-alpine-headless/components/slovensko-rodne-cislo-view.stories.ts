import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="slovensko-rodne-cislo-view"\n  ><span class="screen-reader-span">Slovak Personal Number </span></span\n>';

const meta = {
    title: "Headless/Slovensko Rodne Cislo View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
