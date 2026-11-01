import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="viet-nam-can-cuoc-cong-dan-view"
  aria-label="Citizen Identification Number (CCCD)">sample-value</span>`;

const meta = {
    title: "Headless/VietNamCanCuocCongDanView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
