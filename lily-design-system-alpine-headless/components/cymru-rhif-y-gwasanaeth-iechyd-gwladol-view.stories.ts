import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-view"\n  ><span class="screen-reader-span">National Health Service Number </span></span\n>';

const meta = {
    title: "Headless/Cymru Rhif YGwasanaeth Iechyd Gwladol View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
