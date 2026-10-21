import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GraphicBlock component -->\n<!--\n  Description: a wrapper for charts and graphics\n  HTML tag: <figure>\n  CSS class: graphic-block\n  Keyboard: None (passive element)\n  Accessibility: role=\"img\", aria-label for accessible name\n-->\n\n<figure\n  class=\"graphic-block\"\n  role=\"img\"\n  aria-label=\"\"\n>\n  <figcaption class=\"graphic-block-caption\">\n    <!-- Consumer provides title, description, notes -->\n  </figcaption>\n  <div class=\"graphic-block-content\">\n    <!-- Consumer provides chart/graphic -->\n  </div>\n</figure>";

const meta = {
  title: 'Headless/Graphic Block',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
