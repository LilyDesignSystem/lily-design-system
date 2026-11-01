import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="pakistan-computerized-national-identity-card-input"\n  type="text"\n  aria-label="Computerized National Identity Card Number (CNIC)"\n  autocomplete="off"\n/>';

const meta = {
    title: "Headless/Pakistan Computerized National Identity Card Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
