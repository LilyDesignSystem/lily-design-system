import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="ecuador-cedula-de-identidad-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Cedula de Identidad Number">`;

const meta = {
    title: "Headless/EcuadorCedulaDeIdentidadInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
