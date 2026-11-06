import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="tuaisceart-eireann-health-and-care-number-view"\n  ><span class="screen-reader-span">H&amp;C Number </span></span\n>';

const meta = {
    title: "Headless/Tuaisceart Eireann Health And Care Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
