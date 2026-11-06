import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="eesti-isikukood-view"\n  ><span class="screen-reader-span">Personal Identification Code </span></span\n>';

const meta = {
    title: "Headless/Eesti Isikukood View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
