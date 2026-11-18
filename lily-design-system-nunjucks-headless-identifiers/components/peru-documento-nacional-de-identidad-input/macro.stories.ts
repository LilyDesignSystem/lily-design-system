import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="peru-documento-nacional-de-identidad-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Documento Nacional de Identidad (DNI)">`;

const meta = {
    title: "Headless/PeruDocumentoNacionalDeIdentidadInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
