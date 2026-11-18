import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="al-imarat-raqm-al-huwiyah-view"\n  ><span class="screen-reader-span">Emirates ID number </span></span\n>';

const meta = {
    title: "Headless/Al Imarat Raqm Al Huwiyah View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
