import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="viet-nam-can-cuoc-cong-dan-view"\n  aria-label="Citizen Identification Number (CCCD)"\n></span>';

const meta = {
    title: "Headless/Viet Nam Can Cuoc Cong Dan View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
