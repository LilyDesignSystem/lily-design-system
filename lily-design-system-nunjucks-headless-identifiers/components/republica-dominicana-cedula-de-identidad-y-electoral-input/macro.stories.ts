import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="republica-dominicana-cedula-de-identidad-y-electoral-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Cédula de Identidad y Electoral">`;

const meta = {
    title: "Headless/RepublicaDominicanaCedulaDeIdentidadYElectoralInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
