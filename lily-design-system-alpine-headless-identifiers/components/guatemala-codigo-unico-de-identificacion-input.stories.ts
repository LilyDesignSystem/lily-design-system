import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="guatemala-codigo-unico-de-identificacion-input"\n  type="text"\n  aria-label="Código Único de Identificación (CUI)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Guatemala Codigo Unico De Identificacion Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
