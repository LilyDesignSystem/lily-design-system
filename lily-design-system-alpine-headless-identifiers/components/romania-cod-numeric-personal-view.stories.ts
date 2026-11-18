import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="romania-cod-numeric-personal-view"\n  ><span class="screen-reader-span">Personal Numerical Code </span></span\n>';

const meta = {
    title: "Headless/Romania Cod Numeric Personal View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
