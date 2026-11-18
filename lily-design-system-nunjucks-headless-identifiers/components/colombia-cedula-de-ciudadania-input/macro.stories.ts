import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="colombia-cedula-de-ciudadania-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Cedula de Ciudadania Number">`;

const meta = {
    title: "Headless/ColombiaCedulaDeCiudadaniaInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
