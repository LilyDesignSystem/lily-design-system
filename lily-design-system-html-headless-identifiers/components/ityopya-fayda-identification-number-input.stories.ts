import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="ityopya-fayda-identification-number-input"
  type="text"
  aria-label="Fayda Identification Number (FIN)"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/ItyopyaFaydaIdentificationNumberInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
