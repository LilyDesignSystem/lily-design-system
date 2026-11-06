import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="pilipinas-philhealth-identification-number-view"\n  ><span class="screen-reader-span">PhilHealth Identification Number (PIN) </span></span\n>';

const meta = {
    title: "Headless/Pilipinas Philhealth Identification Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
