import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="osterreich-sozialversicherungsnummer-view"\n  ><span class="screen-reader-span">Sozialversicherungsnummer (SVNR) </span></span\n>';

const meta = {
    title: "Headless/Osterreich Sozialversicherungsnummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
