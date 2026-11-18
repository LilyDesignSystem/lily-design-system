import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="aotearoa-national-health-index-view"\n  ><span class="screen-reader-span">National Health Index (NHI) Number </span></span\n>';

const meta = {
    title: "Headless/Aotearoa National Health Index View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
