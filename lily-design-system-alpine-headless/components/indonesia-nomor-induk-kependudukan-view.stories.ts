import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="indonesia-nomor-induk-kependudukan-view"\n  ><span class="screen-reader-span">Nomor Induk Kependudukan (NIK) </span></span\n>';

const meta = {
    title: "Headless/Indonesia Nomor Induk Kependudukan View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
