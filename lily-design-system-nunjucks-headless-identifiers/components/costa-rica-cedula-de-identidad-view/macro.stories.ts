import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="costa-rica-cedula-de-identidad-view"
  aria-label="Cédula de Identidad">sample-value</span>`;

const meta = {
    title: "Headless/CostaRicaCedulaDeIdentidadView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
