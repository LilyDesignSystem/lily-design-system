import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="medication-view"><span class="medication-view-name">hydr<span class="medication-view-tall-man">ALAZINE</span></span> <span class="medication-view-strength">25&#160;mg</span> <span class="medication-view-form">tablet</span> <span class="medication-view-route">oral</span> <span class="medication-view-frequency">twice daily</span></span>';

const meta = {
    title: "Headless/Medication View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
