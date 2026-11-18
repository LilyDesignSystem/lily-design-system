import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="mexico-clave-unica-de-registro-de-poblacion-view"\n  ><span class="screen-reader-span">Clave Única de Registro de Población (CURP) </span></span\n>';

const meta = {
    title: "Headless/Mexico Clave Unica De Registro De Poblacion View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
