import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="polska-numer-identyfikacji-podatkowej-view"\n  ><span class="screen-reader-span">Tax Identification Number </span></span\n>';

const meta = {
    title: "Headless/Polska Numer Identyfikacji Podatkowej View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
