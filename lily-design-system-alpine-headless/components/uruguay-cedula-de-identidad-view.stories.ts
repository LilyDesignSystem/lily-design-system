import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="uruguay-cedula-de-identidad-view"\n  aria-label="Cedula de Identidad Number"\n></span>';

const meta = {
    title: "Headless/Uruguay Cedula De Identidad View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
