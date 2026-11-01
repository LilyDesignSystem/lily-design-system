import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="uruguay-cedula-de-identidad-view"
  aria-label="Cedula de Identidad Number">sample-value</span>`;

const meta = {
    title: "Headless/UruguayCedulaDeIdentidadView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
