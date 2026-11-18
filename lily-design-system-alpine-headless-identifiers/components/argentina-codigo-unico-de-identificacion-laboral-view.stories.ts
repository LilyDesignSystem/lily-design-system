import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="argentina-codigo-unico-de-identificacion-laboral-view"\n  ><span class="screen-reader-span">Código Único de Identificación Laboral (CUIL) </span></span\n>';

const meta = {
    title: "Headless/Argentina Codigo Unico De Identificacion Laboral View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
