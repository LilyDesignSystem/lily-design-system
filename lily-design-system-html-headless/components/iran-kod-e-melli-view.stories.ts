import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="iran-kod-e-melli-view"
  aria-label="National Code (Kod-e Melli)"
>sample-value</span>`;

const meta = {
    title: "Headless/IranKodEMelliView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
