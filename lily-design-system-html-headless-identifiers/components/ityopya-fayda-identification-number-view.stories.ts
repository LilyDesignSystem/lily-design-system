import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="ityopya-fayda-identification-number-view"
  aria-label="Fayda Identification Number (FIN)"
>sample-value</span>`;

const meta = {
    title: "Headless/ItyopyaFaydaIdentificationNumberView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
