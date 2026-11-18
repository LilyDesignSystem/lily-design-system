import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="colombia-cedula-de-ciudadania-view"\n  ><span class="screen-reader-span">Cedula de Ciudadania Number </span></span\n>';

const meta = {
    title: "Headless/Colombia Cedula De Ciudadania View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
