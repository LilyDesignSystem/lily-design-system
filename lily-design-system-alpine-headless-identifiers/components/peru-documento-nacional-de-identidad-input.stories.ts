import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="peru-documento-nacional-de-identidad-input"\n  type="text"\n  aria-label="Documento Nacional de Identidad (DNI)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Peru Documento Nacional De Identidad Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
