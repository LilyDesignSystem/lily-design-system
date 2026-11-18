import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="nihon-kojin-bango-view"\n  ><span class="screen-reader-span">Individual Number / My Number (マイナンバー) </span></span\n>';

const meta = {
    title: "Headless/Nihon Kojin Bango View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
