import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="misr-al-raqm-al-qawmi-view"\n  ><span class="screen-reader-span">الرقم القومي (Al-Raqm Al-Qawmi) </span></span\n>';

const meta = {
    title: "Headless/Misr Al Raqm Al Qawmi View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
