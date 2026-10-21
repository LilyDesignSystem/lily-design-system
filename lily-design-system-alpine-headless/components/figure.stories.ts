import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Figure component -->\n<!--\n  Description: a self-contained figure with optional caption\n  HTML tag: <figure>\n  CSS class: figure\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <figure class=\"figure\" aria-label=\"Example\">\n      ...\n    </figure>\n-->\n\n<figure\n  class=\"figure\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides figure content and optional caption -->\n</figure>";

const meta = {
  title: 'Headless/Figure',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
