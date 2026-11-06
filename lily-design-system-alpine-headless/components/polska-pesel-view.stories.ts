import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="polska-pesel-view"><span class="screen-reader-span">PESEL </span></span>';

const meta = {
    title: "Headless/Polska Pesel View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
