import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="hrvatska-osobni-identifikacijski-broj-view"\n  ><span class="screen-reader-span">Personal Identification Number </span></span\n>';

const meta = {
    title: "Headless/Hrvatska Osobni Identifikacijski Broj View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
