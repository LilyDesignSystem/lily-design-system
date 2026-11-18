import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="sri-lanka-national-identity-card-view"\n  ><span class="screen-reader-span">National Identity Card (NIC) number </span></span\n>';

const meta = {
    title: "Headless/Sri Lanka National Identity Card View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
