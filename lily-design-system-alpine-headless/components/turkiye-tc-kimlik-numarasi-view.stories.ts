import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="turkiye-tc-kimlik-numarasi-view"\n  ><span class="screen-reader-span">T.C. Kimlik Numarası </span></span\n>';

const meta = {
    title: "Headless/Turkiye Tc Kimlik Numarasi View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
