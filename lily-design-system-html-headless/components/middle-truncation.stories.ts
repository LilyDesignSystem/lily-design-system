import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span> holding two <span>s\n  CSS class: middle-truncation (sub-elements: middle-truncation-visual, middle-truncation-full)\n  Keyboard: None\n  Accessibility: the shortened text is aria-hidden; the full text in .middle-truncation-full is what assistive technology,\n    find-in-page and copy receive. The consumer's CSS bounds the root (display: block; overflow: hidden; white-space: nowrap)\n    and visually hides .middle-truncation-full (clipped, never display: none).\n  Attributes on the root: data-ellipsis (required, no default), data-strategy (\"even\" | \"fixed-end\" | \"min-end\"), data-end.\n    The full text is written once, in .middle-truncation-full; the script copies it into the visual span and shortens it.\n  Usage (see the markup below):\n    <span class=\"middle-truncation\" data-ellipsis=\"…\" data-strategy=\"min-end\" data-end=\"6\">\n      <span class=\"middle-truncation-visual\" aria-hidden=\"true\">quarterly-report-final-version-3.pdf</span>\n      <span class=\"middle-truncation-full\">quarterly-report-final-version-3.pdf</span>\n    </span>\n-->\n\n<span class=\"middle-truncation\" data-ellipsis=\"…\" data-strategy=\"min-end\" data-end=\"6\"><span class=\"middle-truncation-visual\" aria-hidden=\"true\">quarterly-report-final-version-3.pdf</span><span class=\"middle-truncation-full\">quarterly-report-final-version-3.pdf</span></span>";

const meta = {
  title: 'Headless/MiddleTruncation',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
