import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="pakistan-computerized-national-identity-card-view"\n  aria-label="Computerized National Identity Card Number (CNIC)"\n></span>';

const meta = {
    title: "Headless/Pakistan Computerized National Identity Card View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
