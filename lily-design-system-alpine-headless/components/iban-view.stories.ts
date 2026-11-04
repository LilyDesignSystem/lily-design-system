import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<span\n  class="iban-view"\n  aria-label="IBAN"\n></span>';

const meta = {
    title: "Headless/Iban View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
