import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="nederland-identiteitskaart-nummer-view"\n  ><span class="screen-reader-span">Dutch National Identity Card Number </span></span\n>';

const meta = {
    title: "Headless/Nederland Identiteitskaart Nummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
