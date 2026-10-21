import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- InsetText component -->\n<!--\n  Description: indented text to distinguish it from surrounding content\n  HTML tag: <div>\n  CSS class: inset-text\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"inset-text\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"inset-text\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Inset Text',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
