import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="iban-input"\n  type="text"\n  aria-label="IBAN"\n  autocomplete="off"\n>';

const meta = {
    title: "Headless/Iban Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
