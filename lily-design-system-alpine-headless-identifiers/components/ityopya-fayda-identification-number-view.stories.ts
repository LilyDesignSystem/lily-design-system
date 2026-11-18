import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="ityopya-fayda-identification-number-view"\n  ><span class="screen-reader-span">Fayda Identification Number (FIN) </span></span\n>';

const meta = {
    title: "Headless/Ityopya Fayda Identification Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
