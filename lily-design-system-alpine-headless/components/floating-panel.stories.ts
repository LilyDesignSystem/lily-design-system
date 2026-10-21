import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FloatingPanel component -->\n<!--\n  Description: a panel that floats above page content\n  HTML tag: <div>\n  CSS class: floating-panel\n  Keyboard: None (passive element)\n  Accessibility: role=\"region\", aria-label for accessible name\n  Usage:\n    <div class=\"floating-panel\" role=\"region\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"floating-panel\"\n  role=\"region\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Floating Panel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
