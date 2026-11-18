import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="qazaqstan-zheke-saikestendiru-nomiri-view"\n  ><span class="screen-reader-span">Individual Identification Number (IIN) </span></span\n>';

const meta = {
    title: "Headless/Qazaqstan Zheke Saikestendiru Nomiri View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
