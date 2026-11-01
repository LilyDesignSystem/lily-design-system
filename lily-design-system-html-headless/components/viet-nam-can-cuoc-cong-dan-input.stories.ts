import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="viet-nam-can-cuoc-cong-dan-input"
  type="text"
  aria-label="Citizen Identification Number (CCCD)"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/VietNamCanCuocCongDanInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
