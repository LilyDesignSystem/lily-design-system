import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="colombia-cedula-de-ciudadania-input"\n  type="text"\n  aria-label="Cedula de Ciudadania Number"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Colombia Cedula De Ciudadania Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
