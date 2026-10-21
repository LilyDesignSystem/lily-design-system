import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- InformationCallout component -->\n<!--\n  Description: a callout box highlighting informational content\n  HTML tag: <div>\n  CSS class: information-callout\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"information-callout\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"information-callout\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Information Callout',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
