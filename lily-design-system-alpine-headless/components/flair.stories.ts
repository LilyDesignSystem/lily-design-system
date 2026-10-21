import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Flair component -->\n<!--\n  Description: a decorative highlight or emphasis element\n  HTML tag: <span>\n  CSS class: flair\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"flair\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"flair\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Flair',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
