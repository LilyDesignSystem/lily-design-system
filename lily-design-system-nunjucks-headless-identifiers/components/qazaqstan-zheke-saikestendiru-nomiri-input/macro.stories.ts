import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="qazaqstan-zheke-saikestendiru-nomiri-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Individual Identification Number (IIN)">`;

const meta = {
    title: "Headless/QazaqstanZhekeSaikestendiruNomiriInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
