import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="guatemala-codigo-unico-de-identificacion-input"
  type="text"
  aria-label="Código Único de Identificación (CUI)"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/GuatemalaCodigoUnicoDeIdentificacionInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
