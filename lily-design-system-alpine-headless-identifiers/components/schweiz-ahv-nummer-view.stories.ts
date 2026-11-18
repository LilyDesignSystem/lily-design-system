import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="schweiz-ahv-nummer-view"\n  ><span class="screen-reader-span">AHV-Nummer / Numéro AVS </span></span\n>';

const meta = {
    title: "Headless/Schweiz Ahv Nummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
