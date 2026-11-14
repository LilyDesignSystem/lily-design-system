import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span class="observation-view" data-interpretation="H" data-status="final"><span class="screen-reader-span">Potassium </span><span class="observation-view-value">5.9</span>&#160;<span class="observation-view-unit">mmol/L</span> <span class="observation-view-flag">High</span> <span class="observation-view-range">3.5–5.3</span></span>`;

const meta = {
    title: "Headless/ObservationView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
