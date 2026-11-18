import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view"\n  ><span class="screen-reader-span">Personal identification number (JShShIR / PINFL) </span></span\n>';

const meta = {
    title: "Headless/Ozbekiston Jismoniy Shaxsning Shaxsiy Identifikatsion Raqami View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
