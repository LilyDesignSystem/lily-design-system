import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="magyarorszag-taj-szam-view"\n  ><span class="screen-reader-span">Társadalombiztosítási Azonosító Jel (TAJ) </span></span\n>';

const meta = {
    title: "Headless/Magyarorszag Taj Szam View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
