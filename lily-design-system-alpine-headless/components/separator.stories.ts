import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Separator component -->\n<!--\n  Description: a horizontal or vertical divider between content sections\n  HTML tag: <hr>\n  CSS class: separator\n  Keyboard: None (passive element)\n  Accessibility: role=\"separator\", aria-label for accessible name\n  Usage:\n    <hr class=\"separator\" role=\"separator\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<hr\n  class=\"separator\"\n  role=\"separator\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Separator',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
