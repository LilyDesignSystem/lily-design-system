import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="peru-documento-nacional-de-identidad-view"\n  ><span class="screen-reader-span">Documento Nacional de Identidad (DNI) </span></span\n>';

const meta = {
    title: "Headless/Peru Documento Nacional De Identidad View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
