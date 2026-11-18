import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="uruguay-cedula-de-identidad-input"\n  type="text"\n  aria-label="Cedula de Identidad Number"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Uruguay Cedula De Identidad Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
