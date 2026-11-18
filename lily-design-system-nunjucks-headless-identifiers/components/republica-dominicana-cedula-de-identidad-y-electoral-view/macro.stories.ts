import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="republica-dominicana-cedula-de-identidad-y-electoral-view"
  aria-label="Cédula de Identidad y Electoral">sample-value</span>`;

const meta = {
    title: "Headless/RepublicaDominicanaCedulaDeIdentidadYElectoralView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
