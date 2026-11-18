import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="iran-kod-e-melli-view"\n  ><span class="screen-reader-span">National Code (Kod-e Melli) </span></span\n>';

const meta = {
    title: "Headless/Iran Kod EMelli View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
