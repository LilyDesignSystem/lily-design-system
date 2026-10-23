import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span> holding two <span>s\n  CSS class: middle-truncation (sub-elements: middle-truncation-visual, middle-truncation-full)\n  Keyboard: None\n  Accessibility: the shortened text is aria-hidden; the full text in .middle-truncation-full is what assistive technology,\n    find-in-page and copy receive. The consumer's CSS bounds the root (display: block; overflow: hidden; white-space: nowrap)\n    and visually hides .middle-truncation-full (clipped, never display: none).\n  Options: text, ellipsis (required, no default), strategy (\"even\" | \"fixed-end\" | \"min-end\"), end\n  Requires: Alpine.js with the Lily plugin (lily-alpine.js)\n-->\n\n<span\n  class=\"middle-truncation\"\n  x-data=\"lilyMiddleTruncation({ text: 'quarterly-report-final-version-3.pdf', ellipsis: '…', strategy: 'min-end', end: 6 })\"\n  x-bind=\"root\"\n><span class=\"middle-truncation-visual\" aria-hidden=\"true\" x-bind=\"visual\">quarterly-report-final-version-3.pdf</span><span class=\"middle-truncation-full\" x-bind=\"full\">quarterly-report-final-version-3.pdf</span></span>";

const meta = {
  title: 'Headless/MiddleTruncation',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
