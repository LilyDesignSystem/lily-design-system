import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="qazaqstan-zheke-saikestendiru-nomiri-input"\n  type="text"\n  aria-label="Individual Identification Number (IIN)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Qazaqstan Zheke Saikestendiru Nomiri Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
