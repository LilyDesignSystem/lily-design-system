import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="lietuva-pasas-view"><span class="screen-reader-span">Lithuanian Passport </span></span>';

const meta = {
    title: "Headless/Lietuva Pasas View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
