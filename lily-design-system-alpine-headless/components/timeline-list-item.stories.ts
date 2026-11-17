import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ol>\n  <li\n    class="timeline-list-item"\n    aria-label="Example"\n  >\n    <!-- Consumer provides child content -->\n  </li>\n  <li\n    class="timeline-list-item"\n    data-entry-state="withheld"\n  >\n    <time datetime="2026-11-03">3 Nov 2026</time>\n    <span class="timeline-list-item-entry-state">Restricted entry</span>\n  </li>\n  <li\n    class="timeline-list-item"\n    data-entry-state="entered-in-error"\n  >\n    <del class="timeline-list-item-entry">Wrong patient</del>\n    <span class="timeline-list-item-entry-state">Entered in error</span>\n  </li>\n</ol>';

const meta = {
    title: "Headless/Timeline List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
