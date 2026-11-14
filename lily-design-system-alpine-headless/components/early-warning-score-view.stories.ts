import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="early-warning-score-view" data-band="high"><span class="early-warning-score-view-system">NEWS2</span> <span class="early-warning-score-view-score">7</span> <span class="early-warning-score-view-band">High</span> <span class="early-warning-score-view-escalation">Urgent response</span></span>';

const meta = {
    title: "Headless/Early Warning Score View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
