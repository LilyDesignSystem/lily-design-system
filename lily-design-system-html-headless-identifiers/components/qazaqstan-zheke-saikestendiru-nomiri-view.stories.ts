import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="qazaqstan-zheke-saikestendiru-nomiri-view"
  aria-label="Individual Identification Number (IIN)"
>sample-value</span>`;

const meta = {
    title: "Headless/QazaqstanZhekeSaikestendiruNomiriView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
