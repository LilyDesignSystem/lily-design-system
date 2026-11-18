import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="viet-nam-can-cuoc-cong-dan-view"\n  ><span class="screen-reader-span">Citizen Identification Number (CCCD) </span></span\n>';

const meta = {
    title: "Headless/Viet Nam Can Cuoc Cong Dan View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
