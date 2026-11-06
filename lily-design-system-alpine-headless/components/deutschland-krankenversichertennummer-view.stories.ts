import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="deutschland-krankenversichertennummer-view"\n  ><span class="screen-reader-span">Health Insurance Number </span></span\n>';

const meta = {
    title: "Headless/Deutschland Krankenversichertennummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
