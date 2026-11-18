import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="suomi-henkilotunnus-view"\n  ><span class="screen-reader-span">Personal Identity Code </span></span\n>';

const meta = {
    title: "Headless/Suomi Henkilotunnus View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
