import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="iran-kod-e-melli-input"\n  type="text"\n  aria-label="National Code (Kod-e Melli)"\n  autocomplete="off"\n/>';

const meta = {
    title: "Headless/Iran Kod EMelli Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
