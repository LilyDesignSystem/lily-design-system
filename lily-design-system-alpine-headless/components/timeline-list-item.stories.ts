import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ol><li class="timeline-list-item" aria-label="Example">\n    <!-- Consumer provides child content -->\n</li>\n<li class="timeline-list-item" data-entry-state="withheld">\n    <time datetime="2026-11-03">3 Nov 2026</time>\n    <span class="timeline-list-item-entry-state">Restricted entry</span>\n</li>\n<li class="timeline-list-item" data-entry-state="entered-in-error">\n    <del class="timeline-list-item-entry">Wrong patient</del>\n    <span class="timeline-list-item-entry-state">Entered in error</span>\n</li></ol>';

const meta = {
    title: "Headless/Timeline List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
