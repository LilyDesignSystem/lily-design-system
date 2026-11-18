import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="peru-documento-nacional-de-identidad-view"
  aria-label="Documento Nacional de Identidad (DNI)"
>sample-value</span>`;

const meta = {
    title: "Headless/PeruDocumentoNacionalDeIdentidadView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
