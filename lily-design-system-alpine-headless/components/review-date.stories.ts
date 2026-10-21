import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ReviewDate component -->\n<!--\n  Description: a display of a content review date\n  HTML tag: <time>\n  CSS class: review-date\n  Keyboard: None (passive element)\n  Accessibility: aria-label gives context; datetime is the ISO 8601 machine-readable date\n  Usage: replace the aria-label and datetime values and the visible text\n-->\n\n<time class=\"review-date\" aria-label=\"Last reviewed\" datetime=\"2026-10-06\">6 October 2026</time>";

const meta = {
  title: 'Headless/Review Date',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
