import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul class="allergy-list" data-status="known" aria-label="Known allergies"><li class="allergy-list-item" data-severity="severe"><span class="allergy-list-item-substance">Penicillin</span> <span class="allergy-list-item-reaction">Anaphylaxis</span> <span class="allergy-list-item-severity">Severe</span> <time class="allergy-list-item-updated" datetime="2026-11-03">Updated 3 Nov 2026</time></li></ul>';

const meta = {
    title: "Headless/Allergy List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
