import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="pakistan-computerized-national-identity-card-view"\n  ><span class="screen-reader-span">Computerized National Identity Card Number (CNIC) </span></span\n>';

const meta = {
    title: "Headless/Pakistan Computerized National Identity Card View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
