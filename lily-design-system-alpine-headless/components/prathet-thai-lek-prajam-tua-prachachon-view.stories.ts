import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="prathet-thai-lek-prajam-tua-prachachon-view"\n  ><span class="screen-reader-span">เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon) </span></span\n>';

const meta = {
    title: "Headless/Prathet Thai Lek Prajam Tua Prachachon View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
