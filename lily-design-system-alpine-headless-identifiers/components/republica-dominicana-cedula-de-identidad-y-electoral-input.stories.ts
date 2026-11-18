import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="republica-dominicana-cedula-de-identidad-y-electoral-input"\n  type="text"\n  aria-label="Cédula de Identidad y Electoral"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Republica Dominicana Cedula De Identidad YElectoral Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
