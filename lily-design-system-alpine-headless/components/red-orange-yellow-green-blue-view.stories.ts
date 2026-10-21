import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RedOrangeYellowGreenBlueView component -->\n<!--\n  Description: a read-only display of a five-level color status\n  HTML tag: <span>\n  CSS class: red-orange-yellow-green-blue-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"red-orange-yellow-green-blue-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"red-orange-yellow-green-blue-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Red Orange Yellow Green Blue View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
