import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="yisrael-teudat-zehut-view"\n  ><span class="screen-reader-span">Teudat Zehut (תעודת זהות) </span></span\n>';

const meta = {
    title: "Headless/Yisrael Teudat Zehut View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
