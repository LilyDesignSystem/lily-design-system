import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul\n  class="allergy-record-list"\n  data-status="known"\n  aria-label="Known allergies"\n>\n  <li\n    class="allergy-record-list-item"\n    data-severity="severe"\n    data-criticality="high"\n    data-clinical-status="active"\n    data-verification-status="confirmed"\n  >\n    <span class="allergy-record-list-item-substance">Penicillin</span>\n    <span class="allergy-record-list-item-reaction">Anaphylaxis</span>\n    <span class="allergy-record-list-item-severity">Severe</span>\n    <span class="allergy-record-list-item-criticality">High risk</span>\n    <span class="allergy-record-list-item-clinical-status">Active</span>\n    <span class="allergy-record-list-item-verification-status">Confirmed</span>\n    <span class="allergy-record-list-item-type">Allergy</span>\n    <span class="allergy-record-list-item-category">Medication</span>\n    <time\n      class="allergy-record-list-item-updated"\n      datetime="2026-11-03"\n      >Updated 3 Nov 2026</time\n    >\n  </li>\n</ul>';

const meta = {
    title: "Headless/Allergy Record List",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
