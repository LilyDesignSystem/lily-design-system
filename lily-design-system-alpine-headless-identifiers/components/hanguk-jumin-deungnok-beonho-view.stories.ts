import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="hanguk-jumin-deungnok-beonho-view"\n  ><span class="screen-reader-span">Resident Registration Number (주민등록번호) </span></span\n>';

const meta = {
    title: "Headless/Hanguk Jumin Deungnok Beonho View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
