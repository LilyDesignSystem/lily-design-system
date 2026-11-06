import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<span class="iban-view"><span class="screen-reader-span">IBAN </span></span>';

const meta = {
    title: "Headless/Iban View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
