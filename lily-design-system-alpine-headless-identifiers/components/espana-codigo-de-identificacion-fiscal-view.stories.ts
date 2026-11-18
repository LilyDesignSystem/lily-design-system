import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="espana-codigo-de-identificacion-fiscal-view"\n  ><span class="screen-reader-span">Tax Identification Code </span></span\n>';

const meta = {
    title: "Headless/Espana Codigo De Identificacion Fiscal View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
