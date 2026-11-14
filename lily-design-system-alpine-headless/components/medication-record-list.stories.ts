import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul\n  class="medication-record-list"\n  data-status="known"\n  aria-label="Current medicines"\n>\n  <li\n    class="medication-record-list-item"\n    data-status="active"\n  >\n    ramipril 5 mg capsule, oral, once a day\n    <span class="medication-record-list-item-status">Active</span>\n    <time\n      class="medication-record-list-item-effective"\n      datetime="2025-03-03"\n      >Since 3 Mar 2025</time\n    >\n  </li>\n</ul>';

const meta = {
    title: "Headless/Medication Record List",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
