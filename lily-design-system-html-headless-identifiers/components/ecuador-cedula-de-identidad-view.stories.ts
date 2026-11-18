import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="ecuador-cedula-de-identidad-view"
  aria-label="Cedula de Identidad Number"
>sample-value</span>`;

const meta = {
    title: "Headless/EcuadorCedulaDeIdentidadView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
