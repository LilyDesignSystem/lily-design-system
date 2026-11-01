import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="iran-kod-e-melli-view"\n  aria-label="National Code (Kod-e Melli)"\n></span>';

const meta = {
    title: "Headless/Iran Kod EMelli View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
