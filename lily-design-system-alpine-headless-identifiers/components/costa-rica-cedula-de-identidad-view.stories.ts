import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="costa-rica-cedula-de-identidad-view"\n  ><span class="screen-reader-span">Cédula de Identidad </span></span\n>';

const meta = {
    title: "Headless/Costa Rica Cedula De Identidad View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
