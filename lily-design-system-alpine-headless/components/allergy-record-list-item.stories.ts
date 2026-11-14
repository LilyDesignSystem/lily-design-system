import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul class="allergy-record-list" data-status="known" aria-label="Known allergies"><li class="allergy-record-list-item" data-severity="severe"><span class="allergy-record-list-item-substance">Penicillin</span> <span class="allergy-record-list-item-reaction">Anaphylaxis</span> <span class="allergy-record-list-item-severity">Severe</span> <time class="allergy-record-list-item-updated" datetime="2026-11-03">Updated 3 Nov 2026</time></li></ul>';

const meta = {
    title: "Headless/Allergy Record List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
