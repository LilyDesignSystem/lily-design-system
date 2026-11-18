import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="chile-rol-unico-nacional-view"\n  ><span class="screen-reader-span">Rol Único Nacional (RUN) </span></span\n>';

const meta = {
    title: "Headless/Chile Rol Unico Nacional View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
