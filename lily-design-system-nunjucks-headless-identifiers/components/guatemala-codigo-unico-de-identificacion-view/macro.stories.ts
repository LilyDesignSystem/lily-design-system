import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="guatemala-codigo-unico-de-identificacion-view"
  aria-label="Código Único de Identificación (CUI)">sample-value</span>`;

const meta = {
    title: "Headless/GuatemalaCodigoUnicoDeIdentificacionView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
