import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="ityopya-fayda-identification-number-input"\n  type="text"\n  aria-label="Fayda Identification Number (FIN)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Ityopya Fayda Identification Number Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
