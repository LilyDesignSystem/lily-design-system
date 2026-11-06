import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="ecuador-cedula-de-identidad-view"\n  ><span class="screen-reader-span">Cedula de Identidad Number </span></span\n>';

const meta = {
    title: "Headless/Ecuador Cedula De Identidad View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
