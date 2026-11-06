import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="espana-tarjeta-sanitaria-individual-view"\n  ><span class="screen-reader-span">TSI </span></span\n>';

const meta = {
    title: "Headless/Espana Tarjeta Sanitaria Individual View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
