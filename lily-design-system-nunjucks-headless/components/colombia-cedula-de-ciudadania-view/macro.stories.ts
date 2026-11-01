import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="colombia-cedula-de-ciudadania-view"
  aria-label="Cedula de Ciudadania Number">sample-value</span>`;

const meta = {
    title: "Headless/ColombiaCedulaDeCiudadaniaView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
