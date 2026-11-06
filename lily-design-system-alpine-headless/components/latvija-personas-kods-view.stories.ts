import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="latvija-personas-kods-view"\n  ><span class="screen-reader-span">Personal Code </span></span\n>';

const meta = {
    title: "Headless/Latvija Personas Kods View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
