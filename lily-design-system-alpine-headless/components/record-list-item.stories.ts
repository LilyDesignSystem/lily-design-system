import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul\n  class="record-list"\n  data-status="known"\n  aria-label="Vital signs"\n>\n  <li\n    class="record-list-item"\n    data-status="final"\n  >\n    Blood pressure 128/82 mmHg <span class="record-list-item-status">Final</span>\n    <time\n      class="record-list-item-updated"\n      datetime="2026-11-03"\n      >Updated 3 Nov 2026</time\n    >\n  </li>\n</ul>';

const meta = {
    title: "Headless/Record List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
