import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="republica-dominicana-cedula-de-identidad-y-electoral-view"\n  ><span class="screen-reader-span">Cédula de Identidad y Electoral </span></span\n>';

const meta = {
    title: "Headless/Republica Dominicana Cedula De Identidad YElectoral View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
