import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="costa-rica-cedula-de-identidad-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Cédula de Identidad">`;

const meta = {
    title: "Headless/CostaRicaCedulaDeIdentidadInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
