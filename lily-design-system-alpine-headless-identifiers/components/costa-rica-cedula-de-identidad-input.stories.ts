import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="costa-rica-cedula-de-identidad-input"\n  type="text"\n  aria-label="Cédula de Identidad"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Costa Rica Cedula De Identidad Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
