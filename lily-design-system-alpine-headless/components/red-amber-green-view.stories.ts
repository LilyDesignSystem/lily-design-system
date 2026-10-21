import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RedAmberGreenView component -->\n<!--\n  Description: a read-only display of a red/amber/green status\n  HTML tag: <span>\n  CSS class: red-amber-green-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"red-amber-green-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"red-amber-green-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Red Amber Green View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
