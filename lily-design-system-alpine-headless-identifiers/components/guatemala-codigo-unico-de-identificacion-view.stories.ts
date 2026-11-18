import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="guatemala-codigo-unico-de-identificacion-view"\n  ><span class="screen-reader-span">Código Único de Identificación (CUI) </span></span\n>';

const meta = {
    title: "Headless/Guatemala Codigo Unico De Identificacion View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
