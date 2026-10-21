import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- WarningCallout component -->\n<!--\n  Description: a callout box highlighting a warning message\n  HTML tag: <div>\n  CSS class: warning-callout\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"warning-callout\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"warning-callout\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Warning Callout',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
