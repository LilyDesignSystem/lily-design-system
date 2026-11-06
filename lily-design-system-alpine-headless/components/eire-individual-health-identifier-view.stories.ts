import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="eire-individual-health-identifier-view"\n  ><span class="screen-reader-span">IHI </span></span\n>';

const meta = {
    title: "Headless/Eire Individual Health Identifier View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
