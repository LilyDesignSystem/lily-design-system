import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="brasil-cartao-nacional-de-saude-view"\n  ><span class="screen-reader-span">Cartão Nacional de Saúde (CNS) </span></span\n>';

const meta = {
    title: "Headless/Brasil Cartao Nacional De Saude View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
