import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="bangladesh-national-identity-card-view"\n  ><span class="screen-reader-span">National ID (NID) number </span></span\n>';

const meta = {
    title: "Headless/Bangladesh National Identity Card View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
