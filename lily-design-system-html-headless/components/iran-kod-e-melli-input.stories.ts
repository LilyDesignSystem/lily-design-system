import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="iran-kod-e-melli-input"
  type="text"
  aria-label="National Code (Kod-e Melli)"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/IranKodEMelliInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
