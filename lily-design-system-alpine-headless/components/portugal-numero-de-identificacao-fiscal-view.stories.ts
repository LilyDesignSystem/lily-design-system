import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="portugal-numero-de-identificacao-fiscal-view"\n  ><span class="screen-reader-span">Tax Identification Number </span></span\n>';

const meta = {
    title: "Headless/Portugal Numero De Identificacao Fiscal View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
